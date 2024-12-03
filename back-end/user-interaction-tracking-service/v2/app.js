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
if (!fs.existsSync(modelsDir)) {
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

// ML Model class
// class UIOptimizationModel {
//   constructor() {
//     this.model = null;
//     this.modelPath = './models/ui-model';
//     this.isModelReady = false;
//   }

//   async initialize() {
//     try {
//       let needsCompilation = true;

//       try {
//         this.model = await tf.loadLayersModel(`file://${this.modelPath}/model.json`);
//         console.log('Loaded existing model');
//         needsCompilation = true;
//       } catch (error) {
//         console.log('Creating new model...');
//         this.model = this.createModel();
//         needsCompilation = false;
//       }

//       if (needsCompilation) {
//         this.model.compile({
//           optimizer: tf.train.adam(0.001),
//           loss: 'meanSquaredError',
//           metrics: ['mse']
//         });
//         console.log('Model compiled');
//       }

//       if (!needsCompilation) {
//         await this.model.save(`file://${this.modelPath}`);
//         console.log('New model saved to disk');
//       }

//       const isWorking = await this.verifyModel();
//       if (!isWorking) {
//         throw new Error('Model verification failed after initialization');
//       }

//       this.isModelReady = true;
//       console.log('Model initialization completed successfully');
//     } catch (error) {
//       console.error('Error in model initialization:', error);
//       this.isModelReady = false;
//       throw error;
//     }
//   }

//   createModel() {
//     const model = tf.sequential();
    
//     model.add(tf.layers.dense({
//       inputShape: [6],
//       units: 32,
//       activation: 'relu',
//       kernelInitializer: 'glorotNormal'
//     }));
    
//     model.add(tf.layers.dense({
//       units: 16,
//       activation: 'relu',
//       kernelInitializer: 'glorotNormal'
//     }));
    
//     model.add(tf.layers.dense({
//       units: 4,
//       activation: 'linear',
//       kernelInitializer: 'glorotNormal'
//     }));

//     model.compile({
//       optimizer: tf.train.adam(0.001),
//       loss: 'meanSquaredError',
//       metrics: ['mse']
//     });

//     console.log('Model created and compiled successfully');
//     return model;
//   }

//   async verifyModel() {
//     try {
//       const testInput = tf.tensor2d([[0.5, 0.5, 0.2, 0.2, 0.1, 0.1]]);
//       const prediction = await this.model.predict(testInput);
//       const shape = prediction.shape;
//       if (shape[1] !== 4) {
//         throw new Error(`Invalid prediction shape: expected [n,4], got [${shape}]`);
//       }
//       testInput.dispose();
//       prediction.dispose();
//       return true;
//     } catch (error) {
//       console.error('Model verification failed:', error);
//       return false;
//     }
//   }

//   async trainModel(interactions) {
//     try {
//       if (!this.isModelReady || !this.model) {
//         await this.initialize();
//       }

//       const successfulClicks = interactions.filter(i => !i.isMissClick);
//       if (successfulClicks.length < 3) {
//         throw new Error('Not enough successful clicks for training');
//       }

//       // Calculate touch point precision
//       const touchPoints = successfulClicks.map(click => ({
//         x: click.touchPoint.x,
//         y: click.touchPoint.y
//       }));

//       // Calculate center point
//       const centerX = touchPoints.reduce((sum, p) => sum + p.x, 0) / touchPoints.length;
//       const centerY = touchPoints.reduce((sum, p) => sum + p.y, 0) / touchPoints.length;

//       // Calculate average deviation from center
//       const deviations = touchPoints.map(point => ({
//         x: Math.abs(point.x - centerX),
//         y: Math.abs(point.y - centerY)
//       }));

//       const avgDeviation = {
//         x: deviations.reduce((sum, d) => sum + d.x, 0) / deviations.length,
//         y: deviations.reduce((sum, d) => sum + d.y, 0) / deviations.length
//       };

//       // Calculate precision score (0-1)
//       const maxAllowedDeviation = 20; // pixels
//       const precisionScore = Math.min(
//         1,
//         1 - (Math.max(avgDeviation.x, avgDeviation.y) / maxAllowedDeviation)
//       );

//       console.log('Precision metrics:', {
//         avgDeviation,
//         precisionScore
//       });

//       // Calculate optimal size based on precision
//       const baseSizeMultiplier = precisionScore > 0.8 ? 0.7 : 1; // Reduce size for high precision
//       const currentSize = {
//         width: successfulClicks[0].buttonBounds.width,
//         height: successfulClicks[0].buttonBounds.height
//       };

//       // Calculate optimal size
//       const optimalSize = {
//         width: Math.max(
//           Math.min(
//             currentSize.width * baseSizeMultiplier,
//             currentSize.width
//           ),
//           20 // Minimum touch target size
//         ),
//         height: Math.max(
//           Math.min(
//             currentSize.height * baseSizeMultiplier,
//             currentSize.height
//           ),
//           20
//         )
//       };

//       // Prepare training data
//       const tensorData = successfulClicks.map(click => [
//         click.touchPoint.x / click.deviceMetrics.screenWidth,
//         click.touchPoint.y / click.deviceMetrics.screenHeight,
//         click.buttonBounds.x / click.deviceMetrics.screenWidth,
//         click.buttonBounds.y / click.deviceMetrics.screenHeight,
//         click.buttonBounds.width / click.deviceMetrics.screenWidth,
//         click.buttonBounds.height / click.deviceMetrics.screenHeight
//       ]);

//       const targetData = successfulClicks.map(click => [
//         click.touchPoint.x / click.deviceMetrics.screenWidth,
//         click.touchPoint.y / click.deviceMetrics.screenHeight,
//         optimalSize.width / click.deviceMetrics.screenWidth,
//         optimalSize.height / click.deviceMetrics.screenHeight
//       ]);

//       const xs = tf.tensor2d(tensorData);
//       const ys = tf.tensor2d(targetData);

//       const history = await this.model.fit(xs, ys, {
//         epochs: 50,
//         batchSize: Math.min(32, Math.floor(successfulClicks.length / 2)),
//         shuffle: true,
//         validationSplit: 0.2
//       });

//       xs.dispose();
//       ys.dispose();

//       return history;
//     } catch (error) {
//       console.error('Training error:', error);
//       throw error;
//     }
//   }

//   async predict(metrics) {
//     try {
//       if (!this.isModelReady || !this.model) {
//         await this.initialize();
//       }

//       const input = tf.tensor2d([[
//         metrics.x / metrics.screenWidth,
//         metrics.y / metrics.screenHeight,
//         metrics.width / metrics.screenWidth,
//         metrics.height / metrics.screenHeight,
//         1,
//         1
//       ]]);

//       const prediction = await this.model.predict(input);
//       const result = await prediction.array();
      
//       input.dispose();
//       prediction.dispose();

//       // Process predictions with minimum sizes
//       const minWidth = Math.max(metrics.width * 0.8, 44); // Never reduce by more than 20%
//       const minHeight = Math.max(metrics.height * 0.8, 44);

//       return [
//         result[0][0],
//         result[0][1],
//         Math.max(result[0][2] * metrics.screenWidth, minWidth) / metrics.screenWidth,
//         Math.max(result[0][3] * metrics.screenHeight, minHeight) / metrics.screenHeight
//       ];
//     } catch (error) {
//       console.error('Prediction error:', error);
//       throw error;
//     }
//   }
// }


class UIOptimizationModel {
    constructor() {
      this.model = null;
      this.modelPath = path.join(__dirname, 'models', 'ui-model');
      this.isModelReady = false;
    }
  

    async initialize() {
        try {
          let needsCompilation = true;
    
          // Create models directory if it doesn't exist
          if (!fs.existsSync(path.join(__dirname, 'models'))) {
            fs.mkdirSync(path.join(__dirname, 'models'), { recursive: true });
          }
    
          try {
            if (fs.existsSync(path.join(this.modelPath, 'model.json'))) {
              // Load the model using localstorage
              this.model = await tf.loadLayersModel('indexeddb://ui-model');
              console.log('Loaded existing model');
              needsCompilation = true;
            } else {
              throw new Error('Model not found');
            }
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
            // Save using indexeddb
            await this.model.save('indexeddb://ui-model');
            console.log('New model saved');
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
        const prediction = this.model.predict(testInput);
        const shape = prediction.shape;
        const isValid = shape[1] === 4;
        
        testInput.dispose();
        prediction.dispose();
        
        return isValid;
      } catch (error) {
        console.error('Model verification failed:', error);
        return false;
      }
    }
  
    async trainModel(interactions) {
      try {
        if (!this.isModelReady || !this.model) {
          await this.initialize();
        }
  
        const successfulClicks = interactions.filter(i => !i.isMissClick);
        if (successfulClicks.length < 3) {
          throw new Error('Not enough successful clicks for training');
        }
  
        // Prepare training data
        const tensorData = successfulClicks.map(click => [
          click.touchPoint.x / click.deviceMetrics.screenWidth,
          click.touchPoint.y / click.deviceMetrics.screenHeight,
          click.buttonBounds.x / click.deviceMetrics.screenWidth,
          click.buttonBounds.y / click.deviceMetrics.screenHeight,
          click.buttonBounds.width / click.deviceMetrics.screenWidth,
          click.buttonBounds.height / click.deviceMetrics.screenHeight
        ]);
  
        const targetData = successfulClicks.map(click => [
          click.touchPoint.x / click.deviceMetrics.screenWidth,
          click.touchPoint.y / click.deviceMetrics.screenHeight,
          click.buttonBounds.width / click.deviceMetrics.screenWidth,
          click.buttonBounds.height / click.deviceMetrics.screenHeight
        ]);
  
        const xs = tf.tensor2d(tensorData);
        const ys = tf.tensor2d(targetData);
  
        const history = await this.model.fit(xs, ys, {
          epochs: 50,
          batchSize: Math.min(32, Math.floor(successfulClicks.length / 2)),
          shuffle: true,
          validationSplit: 0.2
        });
  
        xs.dispose();
        ys.dispose();
  
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
  
        const prediction = this.model.predict(input);
        const result = await prediction.array();
        
        input.dispose();
        prediction.dispose();
  
        return [
          result[0][0],
          result[0][1],
          Math.max(result[0][2] * metrics.screenWidth, 44) / metrics.screenWidth,
          Math.max(result[0][3] * metrics.screenHeight, 44) / metrics.screenHeight
        ];
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

// app.post('/api/train', async (req, res) => {
//   const { buttonId } = req.body;
  
//   try {
//     const interactions = await TouchInteraction.find({ buttonId });
//     const successfulClicks = interactions.filter(i => !i.isMissClick);

//     if (successfulClicks.length < 3) {
//       return res.status(400).json({ 
//         error: 'Not enough successful clicks for training',
//         requiredSamples: 3,
//         currentSamples: successfulClicks.length
//       });
//     }

//     console.log(`Training model with ${successfulClicks.length} successful interactions out of ${interactions.length} total`);
    
//     try {
//       const history = await mlModel.trainModel(interactions);
//       await mlModel.model.save(`file://${mlModel.modelPath}`);
      
//       res.json({ 
//         message: 'Model trained successfully',
//         dataPoints: {
//           total: interactions.length,
//           successful: successfulClicks.length
//         },
//         history: history.history,
//         metrics: {
//           finalLoss: history.history.loss[history.history.loss.length - 1],
//           finalValidationLoss: history.history.val_loss?.[history.history.val_loss.length - 1]
//         }
//       });
//     } catch (trainingError) {
//       console.error('Training error:', trainingError);
//       res.status(500).json({ 
//         error: 'Error during model training',
//         details: trainingError.message 
//       });
//     }
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({ 
//       error: 'Error accessing training data',
//       details: error.message 
//     });
//   }
// });


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
        // Update model saving
        await mlModel.model.save('indexeddb://ui-model');
        
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
  
      // Get successful clicks
      const successfulClicks = interactions.filter(i => !i.isMissClick);
      
      if (successfulClicks.length === 0) {
        return res.status(404).json({
          error: 'No successful clicks found for this button'
        });
      }
  
      // Calculate touch point spread
      const touchPoints = successfulClicks.map(click => ({
        x: click.touchPoint.x,
        y: click.touchPoint.y
      }));
  
      const xValues = touchPoints.map(p => p.x);
      const yValues = touchPoints.map(p => p.y);
      const xSpread = Math.max(...xValues) - Math.min(...xValues);
      const ySpread = Math.max(...yValues) - Math.min(...yValues);
  
      // Calculate average dimensions from successful interactions
      const avgDimensions = successfulClicks.reduce((acc, click) => {
        return {
          width: acc.width + Math.abs(click.buttonBounds.width),
          height: acc.height + Math.abs(click.buttonBounds.height)
        };
      }, { width: 0, height: 0 });
  
      avgDimensions.width /= successfulClicks.length;
      avgDimensions.height /= successfulClicks.length;
  
      // Calculate miss click rate
      const missClickRate = (interactions.length - successfulClicks.length) / interactions.length;
  
      // Calculate precision score
      const maxSpread = 20; // pixels
      const precisionScore = 1 - Math.min(Math.max(xSpread, ySpread) / maxSpread, 1);
  
      // Calculate size adjustment factors
      let widthAdjustment, heightAdjustment;
  
      if (missClickRate > 0.3) {
        // High miss rate - increase size
        const increaseAmount = Math.min(missClickRate * 0.5, 0.2); // Max 20% increase
        widthAdjustment = heightAdjustment = 1 + increaseAmount;
      } else if (precisionScore > 0.8) {
        // High precision - decrease size
        const decreaseAmount = Math.min(precisionScore * 0.3, 0.2); // Max 20% decrease
        widthAdjustment = heightAdjustment = 1 - decreaseAmount;
      } else {
        // Maintain current size
        widthAdjustment = heightAdjustment = 1;
      }
  
      // Calculate recommended dimensions
      const recommendedDimensions = {
        width: Math.max(Math.round(avgDimensions.width * widthAdjustment), 44),
        height: Math.max(Math.round(avgDimensions.height * heightAdjustment), 44)
      };
  
      // Calculate size changes
      const widthChange = Math.round(((recommendedDimensions.width - avgDimensions.width) / avgDimensions.width) * 100);
      const heightChange = Math.round(((recommendedDimensions.height - avgDimensions.height) / avgDimensions.height) * 100);
  
      // Determine overall adjustment direction and magnitude
      const maxChange = Math.max(Math.abs(widthChange), Math.abs(heightChange));
      const changeType = maxChange === 0 ? 'no change' :
        maxChange === Math.abs(widthChange) ? 
          (widthChange > 0 ? 'increase' : 'decrease') :
          (heightChange > 0 ? 'increase' : 'decrease');
  
      res.json({
        buttonId,
        recommendations: {
          dimensions: recommendedDimensions,
          statistics: {
            totalInteractions: interactions.length,
            successfulClicks: successfulClicks.length,
            missClickRate: Math.round(missClickRate * 100),
            confidence: successfulClicks.length / 10,
            precisionScore: Math.round(precisionScore * 100)
          },
          source: 'ml_model',
          adjustmentFactor: maxChange === 0 ? 'no change' : `${Math.abs(maxChange)}% ${changeType}`,
          originalAverage: {
            width: Math.round(avgDimensions.width),
            height: Math.round(avgDimensions.height)
          },
          sizeChanges: {
            width: widthChange,
            height: heightChange
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