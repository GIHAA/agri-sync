// Backend (Node.js with Express and TensorFlow.js)
// server.js
const express = require('express');
const mongoose = require('mongoose');
const tf = require('@tensorflow/tfjs-node');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb+srv://agrisync:55e3QB2Hgn2yLTtD@cluster0.zm87w.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

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
class UIOptimizationModel {
  constructor() {
    this.model = null;
    this.modelPath = './models/ui-model';
  }

  async initialize() {
    try {
      // Try to load existing model
      try {
        this.model = await tf.loadLayersModel(`file://${this.modelPath}/model.json`);
      } catch (error) {
        console.log('Creating new model...');
        this.model = this.createModel();
        await this.model.save(`file://${this.modelPath}`);
        console.log('Model saved to disk');
      }
    } catch (error) {
      console.error('Error initializing model:', error);
    }
  }

  createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      inputShape: [6],
      units: 32,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 4,
      activation: 'linear'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    return model;
  }

  preprocessData(interactions) {
    return tf.tidy(() => {
      const tensor_data = interactions.map(interaction => [
        interaction.touchPoint.x / interaction.deviceMetrics.screenWidth,
        interaction.touchPoint.y / interaction.deviceMetrics.screenHeight,
        interaction.buttonBounds.x / interaction.deviceMetrics.screenWidth,
        interaction.buttonBounds.y / interaction.deviceMetrics.screenHeight,
        interaction.buttonBounds.width / interaction.deviceMetrics.screenWidth,
        interaction.buttonBounds.height / interaction.deviceMetrics.screenHeight
      ]);
      
      return tf.tensor2d(tensor_data);
    });
  }

//   async trainModel(interactions) {
//     return tf.tidy(() => {
//       const x = this.preprocessData(interactions);
      
//       const successfulClicks = interactions.filter(i => !i.isMissClick);
//       const y = tf.tensor2d(successfulClicks.map(click => [
//         click.touchPoint.x / click.deviceMetrics.screenWidth,
//         click.touchPoint.y / click.deviceMetrics.screenHeight,
//         click.buttonBounds.width / click.deviceMetrics.screenWidth * 1.1,
//         click.buttonBounds.height / click.deviceMetrics.screenHeight * 1.1
//       ]));

//       return this.model.fit(x, y, {
//         epochs: 50,
//         batchSize: 32,
//         shuffle: true,
//         validationSplit: 0.2
//       });
//     });
//   }

//   async predict(metrics) {
//     return tf.tidy(() => {
//       const input = tf.tensor2d([[
//         metrics.x / metrics.screenWidth,
//         metrics.y / metrics.screenHeight,
//         metrics.width / metrics.screenWidth,
//         metrics.height / metrics.screenHeight,
//         1,
//         1
//       ]]);

//       const prediction = this.model.predict(input);
//       return prediction.arraySync()[0];
//     });
//   }

  async trainModel(interactions) {
    try {
      // Prepare the data outside of tf.tidy
      const tensorData = interactions.map(interaction => [
        interaction.touchPoint.x / interaction.deviceMetrics.screenWidth,
        interaction.touchPoint.y / interaction.deviceMetrics.screenHeight,
        interaction.buttonBounds.x / interaction.deviceMetrics.screenWidth,
        interaction.buttonBounds.y / interaction.deviceMetrics.screenHeight,
        interaction.buttonBounds.width / interaction.deviceMetrics.screenWidth,
        interaction.buttonBounds.height / interaction.deviceMetrics.screenHeight
      ]);

      const successfulClicks = interactions.filter(i => !i.isMissClick);
      const targetData = successfulClicks.map(click => [
        click.touchPoint.x / click.deviceMetrics.screenWidth,
        click.touchPoint.y / click.deviceMetrics.screenHeight,
        click.buttonBounds.width / click.deviceMetrics.screenWidth * 1.1,
        click.buttonBounds.height / click.deviceMetrics.screenHeight * 1.1
      ]);

      // Create tensors
      const xs = tf.tensor2d(tensorData);
      const ys = tf.tensor2d(targetData);

      // Train the model
      const history = await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: Math.min(32, Math.floor(interactions.length / 2)),
        shuffle: true,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
          }
        }
      });

      // Clean up tensors
      xs.dispose();
      ys.dispose();

      return history;
    } catch (error) {
      console.error('Training error:', error);
      throw error;
    }
  }

  async predict(metrics) {
    const input = tf.tensor2d([[
      metrics.x / metrics.screenWidth,
      metrics.y / metrics.screenHeight,
      metrics.width / metrics.screenWidth,
      metrics.height / metrics.screenHeight,
      1,
      1
    ]]);

    try {
      const prediction = await this.model.predict(input);
      const result = await prediction.array();
      
      // Clean up tensors
      input.dispose();
      prediction.dispose();

      return result[0];
    } catch (error) {
      input.dispose();
      throw error;
    }
  }

}

// Initialize ML model
const mlModel = new UIOptimizationModel();
mlModel.initialize();




// Add this to your server.js

app.post('/api/bulk-touch-interactions', async (req, res) => {
    try {
      const interactions = req.body; // Expecting an array of interactions
      if (!Array.isArray(interactions)) {
        return res.status(400).json({ error: 'Request body must be an array' });
      }
  
      // Save all interactions in bulk
      await TouchInteraction.insertMany(interactions);
  
      res.status(201).json({ message: 'Bulk interactions saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving bulk interactions', details: error.message });
    }
  });
  

// API Routes
app.post('/api/touch-interactions', async (req, res) => {
  try {
    const interaction = new TouchInteraction(req.body);
    await interaction.save();
    res.status(201).json({ message: 'Interaction saved' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving interaction' });
  }
});

app.post('/api/train', async (req, res) => {
  const { buttonId } = req.body;
  
  try {
    const interactions = await TouchInteraction.find({ buttonId });
    if (interactions.length < 5) {
      return res.status(400).json({ 
        error: 'Not enough data for training' 
      });
    }

    console.log('Training model with', interactions.length, 'interactions');

    const history = await mlModel.trainModel(interactions);
    await mlModel.model.save(`file://${mlModel.modelPath}`);

    console.log('Model trained successfully');

    res.json({ 
      message: 'Model trained successfully',
      history: history.history
    });
  } catch (error) {
    res.status(500).json({ error: 'Error training model' });
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
    res.status(500).json({ error: 'Error making prediction' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});