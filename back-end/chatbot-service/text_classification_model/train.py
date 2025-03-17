import spacy
from spacy.training.example import Example

# Load a pre-trained model
nlp = spacy.load("en_core_web_md")

train_data = [
    ("What should I plant for the upcoming season?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant in a dry region?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for the winter season?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for the rainy season?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant in my garden this spring?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I grow for a small farm?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for a tropical climate?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant in clay soil?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant in a greenhouse?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant in cold weather?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for organic farming?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant for minimal water usage?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant to avoid pests?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant for better soil health?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for sustainability?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant in my raised garden bed?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant to improve soil fertility?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for pollinators?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What crops should I plant for a greenhouse?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for winter gardening?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for the fall harvest?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant for maximum yield?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}}),
    ("What should I plant to improve biodiversity?", {"cats": {"crop_recommendation": 1, "not_crop_recommendation": 0}})
]




# Add text classifier to pipeline
if "textcat" not in nlp.pipe_names:
    text_categorizer = nlp.add_pipe("textcat", last=True)
else:
    text_categorizer = nlp.get_pipe("textcat")

# Add labels for crop recommendation and knowledge-based queries
text_categorizer.add_label("crop_recommendation")
text_categorizer.add_label("not_crop_recommendation")

# Training the model
optimizer = nlp.begin_training()

# Set the learning rate (if needed, this can be adjusted here)
nlp.config["training"]["optimizer"]["lr"] = 0.001

# Training loop
for epoch in range(50):
    losses = {}
    for text, annotations in train_data:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annotations)
        nlp.update([example], drop=0.5, losses=losses)
    print(f"Epoch {epoch}, Losses: {losses}")

# Save the trained model
nlp.to_disk("text_classification_model")
