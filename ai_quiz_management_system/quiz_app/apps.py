from django.apps import AppConfig
import os

class QuizAppConfig(AppConfig):
    name = 'quiz_app'


    def ready(self):
        if os.environ.get("RUN_MAIN") != "true":
            return

        from quiz_app.config import configure

        print("Loading AI components...")

        configure.get_llm()
        configure.get_embeddings()

        print("AI components loaded successfully.")
