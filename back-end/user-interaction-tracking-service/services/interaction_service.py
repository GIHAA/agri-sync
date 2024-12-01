from repositories.interaction_repo import InteractionRepository
from models.interaction import Interaction

class InteractionService:
    def __init__(self):
        self.repo = InteractionRepository()

    def log_button_interaction(self, data):
        # Extract data and create Interaction object
        interaction = Interaction(
            button_id=data['button_id'],
            timestamp=data['timestamp'],
            user_id=data['user_id'],
            click_coordinates=data['click_coordinates'],
            missed_click_distance=data['missed_click_distance'],
            is_miss_click=data['is_miss_click'],
            session_duration=data['session_duration'],
            device=data['device']
        )
        # Save interaction to MongoDB
        self.repo.save_interaction(interaction)

    def get_user_interactions(self, user_id):
        return self.repo.get_interactions(user_id)
