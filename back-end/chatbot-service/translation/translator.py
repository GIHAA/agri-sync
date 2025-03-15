import asyncio
from googletrans import Translator

async def translate_sin_to_en(text):
    translator = Translator()
    translated = await translator.translate(text, src='si', dest='en')  # Synchronous call
    print("Translator initiated, Translating Sinhala to English...")
    return translated.text
