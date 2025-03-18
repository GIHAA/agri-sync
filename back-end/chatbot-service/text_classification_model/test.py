import spacy

# Load the trained text classification model
nlp = spacy.load("text_classification_model")

# Test a new query
test_query = "hi?"
doc = nlp(test_query)

if doc.cats["crop_recommendation"] > 0.5:
    print("Crop recommendation query")
else:
    print("Knowledge-based query")
