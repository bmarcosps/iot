import speech_recognition as sr
import time

import argparse

r = sr.Recognizer()
#m = sr.Microphone()
#
#with m as source:
#    r.adjust_for_ambient_noise(source)
#
#    print('Fala:')
#
#    audio = r.record(m, 2)
#
#    result = r.recognize_google(audio, language='pt-br')
#
#    print(result)

# file_path = r'C:\Users\bruno\Desktop\Internet of Tretas\file.wav'

parser = argparse.ArgumentParser(description='processa um arquivo de audio')
parser.add_argument('file', type=str, action='store', help='caminho do arquivo')

args = parser.parse_args()

file_path = args.file

try:
    audio_file = sr.AudioFile(file_path)
    with audio_file as source:
        audio = r.record(source)

        try:
            result = r.recognize_google(audio, language='pt-br')
            print(result)
        except sr.UnknownValueError:
            print('Não foi possível entender o áudio')
except FileNotFoundError:
    print('Caminho do arquivo inválido')
