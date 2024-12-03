// server.js
const express = require('express');
const mongoose = require('mongoose');
const tf = require('@tensorflow/tfjs-node');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb+srv://agrisync:55e3QB2Hgn2yLTtD@cluster0.zm87w.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Ensure models directory exists
const modelsDir = './models';
if (!fs.existsSync(modelsDir)){
    fs.mkdirSync(modelsDir);
}

// MongoDB Schema
const TouchInteractionSchema = new mongoose.Schema({
  buttonId: String,
  timestamp: { type: Date, default: Date.now },
  touchPoint: {
    x: Number,
    y: Number
  },
  buttonBounds: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  isMissClick: Boolean,
  deviceMetrics: {
    screenWidth: Number,
    screenHeight: Number,
    deviceOrientation: String
  }
});

const TouchInteraction = mongoose.model('TouchInteraction', TouchInteractionSchema);

class UIOptimizationModel {
  constructor() {
    this.model = null;
    this.modelPath = './models/ui-model';
    this.isModelReady = false;
  }

  async initialize() {
    try {
      let needsCompilation = true;

      try {
        this.model = await tf.loadLayersModel(`file://${this.modelPath}/model.json`);
        console.log('Loaded existing model');
        needsCompilation = true;
      } catch (error) {
        console.log('Creating new model...');
        this.model = this.createModel();
        needsCompilation = false;
      }

      if (needsCompilation) {
        this.model.compile({
          optimizer: tf.train.adam(0.001),
          loss: 'meanSquaredError',
          metrics: ['mse']
        });
        console.log('Model compiled');
      }

      if (!needsCompilation) {
        await this.model.save(`file://${this.modelPath}`);
        console.log('New model saved to disk');
      }

      const isWorking = await this.verifyModel();
      if (!isWorking) {
        throw new Error('Model verification failed after initialization');
      }

      this.isModelReady = true;
      console.log('Model initialization completed successfully');
    } catch (error) {
      console.error('Error in model initialization:', error);
      this.isModelReady = false;
      throw error;
    }
  }

  createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      inputShape: [6],
      units: 32,
      activation: 'relu',
      kernelInitializer: 'glorotNormal'
    }));
    
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      kernelInitializer: 'glorotNormal'
    }));
    
    model.add(tf.layers.dense({
      units: 4,
      activation: 'linear',
      kernelInitializer: 'glorotNormal'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mse']
    });

    console.log('Model created and compiled successfully');
    return model;
  }

  async verifyModel() {
    try {
      const testInput = tf.tensor2d([[0.5, 0.5, 0.2, 0.2, 0.1, 0.1]]);
      const prediction = await this.model.predict(testInput);
      const shape = prediction.shape;
      if (shape[1] !== 4) {
        throw new Error(`Invalid prediction shape: expected [n,4], got [${shape}]`);
      }
      testInput.dispose();
      prediction.dispose();
      return true;
    } catch (error) {
      console.error('Model verification failed:', error);
      return false;
    }
  }

  async trainModel(interactions) {
    try {
      if (!this.isModelReady || !this.model) {
        console.log('Model not ready, reinitializing...');
        await this.initialize();
      }

      console.log('Preparing training data...');
      
      // First, filter successful clicks
      const successfulClicks = interactions.filter(i => !i.isMissClick);
      if (successfulClicks.length < 3) {
        throw new Error('Not enough successful clicks for training (minimum 3 required)');
      }

      // Prepare input data only from successful clicks
      const tensorData = successfulClicks.map(click => [
        click.touchPoint.x / click.deviceMetrics.screenWidth,
        click.touchPoint.y / click.deviceMetrics.screenHeight,
        click.buttonBounds.x / click.deviceMetrics.screenWidth,
        click.buttonBounds.y / click.deviceMetrics.screenHeight,
        click.buttonBounds.width / click.deviceMetrics.screenWidth,
        click.buttonBounds.height / click.deviceMetrics.screenHeight
      ]);

      // Prepare target data from the same successful clicks
      const targetData = successfulClicks.map(click => [
        click.touchPoint.x / click.deviceMetrics.screenWidth,
        click.touchPoint.y / click.deviceMetrics.screenHeight,
        click.buttonBounds.width / click.deviceMetrics.screenWidth * 1.1, // Slightly larger for better clickability
        click.buttonBounds.height / click.deviceMetrics.screenHeight * 1.1
      ]);

      console.log(`Training with ${successfulClicks.length} successful interactions`);

      // Create tensors
      const xs = tf.tensor2d(tensorData);
      const ys = tf.tensor2d(targetData);

      console.log('Starting training...');
      
      // Train the model with early stopping
      const history = await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: Math.min(32, Math.floor(successfulClicks.length / 2)),
        shuffle: true,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}`);
          }
        }
      });

      // Clean up tensors
      xs.dispose();
      ys.dispose();

      console.log('Training completed successfully');
      return history;
    } catch (error) {
      console.error('Training error:', error);
      throw error;
    }
  }

  async predict(metrics) {
    try {
      if (!this.isModelReady || !this.model) {
        await this.initialize();
      }

      const input = tf.tensor2d([[
        metrics.x / metrics.screenWidth,
        metrics.y / metrics.screenHeight,
        metrics.width / metrics.screenWidth,
        metrics.height / metrics.screenHeight,
        1,
        1
      ]]);

      const prediction = await this.model.predict(input);
      const result = await prediction.array();
      
      input.dispose();
      prediction.dispose();

      return result[0];
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
}

// Initialize ML model
const mlModel = new UIOptimizationModel();

// API Routes
app.get('/api/model-status', async (req, res) => {
  try {
    if (!mlModel.isModelReady) {
      return res.json({ 
        status: 'not_ready', 
        message: 'Model is not initialized' 
      });
    }

    const isWorking = await mlModel.verifyModel();
    res.json({
      status: isWorking ? 'ready' : 'error',
      message: isWorking ? 'Model is working correctly' : 'Model verification failed',
      modelInfo: {
        isCompiled: mlModel.model.compiled,
        layers: mlModel.model.layers.length,
        inputShape: mlModel.model.inputs[0].shape,
        outputShape: mlModel.model.outputs[0].shape
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Error checking model status',
      error: error.message 
    });
  }
});

app.post('/api/touch-interactions', async (req, res) => {
  try {
    const interaction = new TouchInteraction(req.body);
    await interaction.save();
    res.status(201).json({ message: 'Interaction saved' });
  } catch (error) {
    console.error('Error saving interaction:', error);
    res.status(500).json({ error: 'Error saving interaction', details: error.message });
  }
});

app.post('/api/bulk-touch-interactions', async (req, res) => {
  try {
    const interactions = req.body;
    if (!Array.isArray(interactions)) {
      return res.status(400).json({ error: 'Request body must be an array' });
    }

    await TouchInteraction.insertMany(interactions);
    res.status(201).json({ 
      message: 'Bulk interactions saved successfully',
      count: interactions.length
    });
  } catch (error) {
    console.error('Error saving bulk interactions:', error);
    res.status(500).json({ error: 'Error saving bulk interactions', details: error.message });
  }
});

app.post('/api/train', async (req, res) => {
  const { buttonId } = req.body;
  
  try {
    const interactions = await TouchInteraction.find({ buttonId });
    const successfulClicks = interactions.filter(i => !i.isMissClick);

    if (successfulClicks.length < 3) {
      return res.status(400).json({ 
        error: 'Not enough successful clicks for training',
        requiredSamples: 3,
        currentSamples: successfulClicks.length
      });
    }

    console.log(`Training model with ${successfulClicks.length} successful interactions out of ${interactions.length} total`);
    
    try {
      const history = await mlModel.trainModel(interactions);
      await mlModel.model.save(`file://${mlModel.modelPath}`);
      
      res.json({ 
        message: 'Model trained successfully',
        dataPoints: {
          total: interactions.length,
          successful: successfulClicks.length
        },
        history: history.history,
        metrics: {
          finalLoss: history.history.loss[history.history.loss.length - 1],
          finalValidationLoss: history.history.val_loss?.[history.history.val_loss.length - 1]
        }
      });
    } catch (trainingError) {
      console.error('Training error:', trainingError);
      res.status(500).json({ 
        error: 'Error during model training',
        details: trainingError.message 
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Error accessing training data',
      details: error.message 
    });
  }
});

app.post('/api/predict', async (req, res) => {
  const { metrics } = req.body;
  
  try {
    const prediction = await mlModel.predict(metrics);
    res.json({
      x: prediction[0] * metrics.screenWidth,
      y: prediction[1] * metrics.screenHeight,
      width: prediction[2] * metrics.screenWidth,
      height: prediction[3] * metrics.screenHeight
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Error making prediction',
      details: error.message 
    });
  }
});

app.get('/api/button-recommendations/:buttonId', async (req, res) => {
    const { buttonId } = req.params;
    
    try {
      const interactions = await TouchInteraction.find({ buttonId });
      
      if (interactions.length === 0) {
        return res.status(404).json({
          error: 'No interaction data found for this button'
        });
      }
  
      const successfulClicks = interactions.filter(i => !i.isMissClick);
      
      if (successfulClicks.length === 0) {
        return res.status(404).json({
          error: 'No successful clicks found for this button'
        });
      }
  
      const avgDimensions = successfulClicks.reduce((acc, click) => {
        return {
          width: acc.width + click.buttonBounds.width,
          height: acc.height + click.buttonBounds.height
        };
      }, { width: 0, height: 0 });
  
      avgDimensions.width /= successfulClicks.length;
      avgDimensions.height /= successfulClicks.length;
  
      const missClickRate = (interactions.length - successfulClicks.length) / interactions.length;
  
      const adjustmentFactor = 1 + (missClickRate > 0.2 ? 0.2 : missClickRate); // Max 20% increase
  
      const avgScreenDims = successfulClicks.reduce((acc, click) => {
        return {
          width: acc.width + click.deviceMetrics.screenWidth,
          height: acc.height + click.deviceMetrics.screenHeight
        };
      }, { width: 0, height: 0 });
  
      avgScreenDims.width /= successfulClicks.length;
      avgScreenDims.height /= successfulClicks.length;
  
      // Use ML model for prediction if we have enough data
      let mlRecommendation = null;
      if (successfulClicks.length >= 3) {
        try {
          const lastClick = successfulClicks[successfulClicks.length - 1];
          const prediction = await mlModel.predict({
            x: lastClick.buttonBounds.x,
            y: lastClick.buttonBounds.y,
            width: avgDimensions.width,
            height: avgDimensions.height,
            screenWidth: avgScreenDims.width,
            screenHeight: avgScreenDims.height
          });
  
          mlRecommendation = {
            width: prediction[2] * avgScreenDims.width,
            height: prediction[3] * avgScreenDims.height
          };
        } catch (error) {
          console.error('ML prediction error:', error);
          // Continue with statistical recommendation if ML fails
        }
      }
  
      // Final recommendations
      const recommendedDimensions = mlRecommendation || {
        width: avgDimensions.width * adjustmentFactor,
        height: avgDimensions.height * adjustmentFactor
      };
  
      res.json({
        buttonId,
        recommendations: {
          dimensions: {
            width: Math.round(recommendedDimensions.width),
            height: Math.round(recommendedDimensions.height)
          },
          statistics: {
            totalInteractions: interactions.length,
            successfulClicks: successfulClicks.length,
            missClickRate: Math.round(missClickRate * 100),
            confidence: successfulClicks.length / 10 // Simple confidence score (0-1)
          },
          source: mlRecommendation ? 'ml_model' : 'statistical_analysis',
          adjustmentFactor: Math.round(adjustmentFactor * 100 - 100) + '% increase',
          originalAverage: {
            width: Math.round(avgDimensions.width),
            height: Math.round(avgDimensions.height)
          }
        }
      });
  
    } catch (error) {
      console.error('Error getting button recommendations:', error);
      res.status(500).json({
        error: 'Error analyzing button interactions',
        details: error.message
      });
    }
  });

// Initialize server and model
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await mlModel.initialize();
    console.log(`Server running on port ${PORT} with initialized ML model`);
  } catch (error) {
    console.error('Server initialization error:', error);
    console.log('Server will continue running without ML model. Will retry initialization on first request.');
  }
});