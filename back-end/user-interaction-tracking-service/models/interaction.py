class Interaction:
    def __init__(self, button_id, timestamp, user_id, click_coordinates, missed_click_distance, 
                 is_miss_click, session_duration, device):
        self.button_id = button_id
        self.timestamp = timestamp
        self.user_id = user_id
        self.click_coordinates = click_coordinates
        self.missed_click_distance = missed_click_distance
        self.is_miss_click = is_miss_click
        self.session_duration = session_duration
        self.device = device

    def to_dict(self):
        return {
            'button_id': self.button_id,
            'timestamp': self.timestamp,
            'user_id': self.user_id,
            'click_coordinates': self.click_coordinates,
            'missed_click_distance': self.missed_click_distance,
            'is_miss_click': self.is_miss_click,
            'session_duration': self.session_duration,
            'device': self.device
        }
