import asyncio
from googletrans import Translator

translator = Translator()

async def translate_sin_to_en(text):
    """Translate Sinhala to English."""
    translated = await translator.translate(text, src='si', dest='en')  # Synchronous call
    print("Translator initiated, Translating Sinhala to English...")
    return translated.text

async def translate_en_to_sin(text):
    """Translate English to Sinhala."""
    translated = await translator.translate(text, src='en', dest='si')  # Synchronous call
    print("Translator initiated, Translating English to Sinhala...")
    return translated.text
