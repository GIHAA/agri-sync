import numpy as np
import json
from flask import Flask, request, jsonify
import logging
import os

app = Flask(__name__)

class SimpleQAgent:
    def __init__(self, n_actions):
        self.n_actions = n_actions
        self.q_table = self.load_q_table()  # Load the Q-table from persistent storage
        self.learning_rate = 0.1
        self.discount_factor = 0.9
        self.exploration_rate = 1.0
        self.exploration_decay = 0.995
        self.exploration_min = 0.01

    def load_q_table(self):
        """Load the Q-table from the JSON file if it exists."""
        if os.path.exists('q_table.json'):
            with open('q_table.json', 'r') as f:
                q_table = np.array(json.load(f))
        else:
            # Initialize Q-table with zeros if it doesn't exist
            q_table = np.zeros(self.n_actions)  # Adjusted for 36 actions
        return q_table

    def save_q_table(self):
        """Save the Q-table to the JSON file."""
        with open('q_table.json', 'w') as f:
            json.dump(self.q_table.tolist(), f)  # Save as list in JSON format

    def update_q_table(self, action, reward):
        """Update the Q-table based on the chosen action and received reward."""
        self.q_table[action] = self.q_table[action] + self.learning_rate * (reward - self.q_table[action])

    def choose_action(self):
        """Choose an action based on the exploration-exploitation tradeoff."""
        if np.random.rand() < self.exploration_rate:
            return np.random.choice(self.n_actions)  # Explore: Choose a random action
        else:
            return np.argmax(self.q_table)  # Exploit: Choose the action with the highest Q-value

    def decay_exploration(self):
        """Decay the exploration rate to favor exploitation over time."""
        self.exploration_rate = max(self.exploration_rate * self.exploration_decay, self.exploration_min)



agent = SimpleQAgent(n_actions=36)

@app.route('/track-interaction', methods=['POST'])
def track_interaction():
    """Endpoint to track button interactions and update the Q-table."""
    data = request.json
    button_clicks = data.get('buttonClicks', 0)
    task_completed = data.get('taskCompleted', False)

    try:
       
        if task_completed:
            reward = 5  # Task completed 
        elif button_clicks > 0:
            reward = 1  # Button clicked but task not completed
        else:
            reward = -1  # No button click (penalize no interaction)

        # Choose an action (button size, color theme, shape, font size combination)
        action = agent.choose_action()

        # Update Q-table based on the chosen action and reward
        agent.update_q_table(action, reward)

        # Decay the exploration rate for future interactions
        agent.decay_exploration()

        # Save the updated Q-table to the JSON file
        agent.save_q_table()

        return jsonify({
            'action': int(action), 
            'exploration_rate': agent.exploration_rate
        })

    except Exception as e:
        app.logger.error(f"Error in track_interaction: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/get-ui-recommendation', methods=['GET'])
def get_ui_recommendation():
    """Endpoint to get the recommended UI action based on the Q-table."""
    try:
        action = int(np.argmax(agent.q_table))  # Choose the action with the highest Q-value
        return jsonify({'action': action})

    except Exception as e:
        app.logger.error(f"Error in get_ui_recommendation: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)

    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=3002)
