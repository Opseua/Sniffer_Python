# pylint: disable=C0103
# pylint: disable=C0301
# pylint: disable=W0621
# pylint: disable=W0718
# pylint: disable=R1732
# pylint: disable=R1702
# pylint: disable=R0914
# pylint: disable=R0915
# pylint: disable=R0912
# pylint: disable=W0602
# pylint: disable=W0603
# pylint: disable=C0115
# pylint: disable=R1710
# pylint: disable=W0622
# pylint: disable=C0410
# pylint: disable=C0114
# pylint: disable=C0116
# ERRO DE IMPORT EM OUTRA PASTA
# pylint: disable=E0401
# ERRO DE IMPORT ANTES DE USAR A VARIÁVEL
# pylint: disable=C0413
# pylint: disable=C0411
# ERRO DE IMPORT 'datetime'
# pylint: disable=E1101
# ERRO IGNORAR ERROS DO CTRL + C
# pylint: disable=W1514
# ERRO 'sig' e 'frame'
# pylint: disable=W0613

# BIBLIOTECAS: NATIVAS
import sys, time

# BIBLIOTECAS: NECESSÁRIO INSTALAR
from flask import Flask
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtCore import QTimer, Qt, pyqtSignal
from PyQt5.QtGui import QFont
from threading import Thread
import logging

# IGNORAR ERROS DO SEERVIDOR HTTP
logging.getLogger("werkzeug").setLevel(logging.ERROR)


class Cronometro(QWidget):
    cronometro_iniciar_signal = pyqtSignal()

    def __init__(self, cor_fundo_rgb, cor_texto_rgb):
        super().__init__()
        self.initUI(cor_fundo_rgb, cor_texto_rgb)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.atualizar_cronometro)
        self.pausado = True
        self.inicio = 0
        self.tempo_decorrido = 0
        self.cronometro_iniciar_signal.connect(self.iniciar_cronometro)
        self.setWindowOpacity(0.2)

    def initUI(self, cor_fundo_rgb, cor_texto_rgb):
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.Tool | Qt.WindowStaysOnTopHint)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.layout = QVBoxLayout()
        self.layout.setContentsMargins(0, 0, 0, 0)
        self.setLayout(self.layout)
        self.label = QLabel("00:00:0")
        self.label.setFont(QFont("Arial", 12))
        self.label.setStyleSheet(
            f"color: rgb({cor_texto_rgb[0]}, {cor_texto_rgb[1]}, {cor_texto_rgb[2]}); "
            f"background-color: rgb({cor_fundo_rgb[0]}, {cor_fundo_rgb[1]}, {cor_fundo_rgb[2]}); "
            "border-radius: 5px; padding: 0px;"
        )
        self.label.setAlignment(Qt.AlignCenter)
        self.layout.addWidget(self.label)

    def atualizar_cronometro(self):
        if self.pausado:
            return
        tempo_decorrido = time.time() - self.inicio + self.tempo_decorrido
        texto = f"{int(tempo_decorrido // 60):02d}:{int(tempo_decorrido % 60):02d}:{int((tempo_decorrido % 1) * 10)}"
        self.label.setText(texto)

    def iniciar_cronometro(self):
        self.inicio = time.time()
        self.pausado = False
        self.timer.start(100)
        self.setWindowOpacity(1.0)

    def resetar_cronometro(self):
        self.inicio = time.time()
        self.tempo_decorrido = 0
        self.pausado = True
        self.timer.stop()
        self.label.setText("00:00:0")
        self.setWindowOpacity(0.2)

    def toggle_cronometro(self):
        if self.pausado:
            self.cronometro_iniciar_signal.emit()
        else:
            self.pausado = True
            self.timer.stop()
            self.tempo_decorrido += time.time() - self.inicio
            self.setWindowOpacity(0.5)


app = Flask(__name__)
cronometros = {}


@app.route("/<action>_<id>", methods=["GET"])
def control(action, id):
    cronometro = cronometros.get(id)
    if cronometro:
        if action == "reset":
            cronometro.resetar_cronometro()
        elif action == "toggle":
            cronometro.toggle_cronometro()
        else:
            return "Ação inválida", 400
    return "OK", 200


def run_flask_server():
    app.run(host="127.0.0.1", port=8888, debug=False, use_reloader=False)


def stopwatchRun():
    app = QApplication(sys.argv)

    cores = [
        ((80, 120, 60), (255, 255, 255)),
        ((140, 30, 45), (255, 255, 255)),
    ]
    for i, (cor_fundo, cor_texto) in enumerate(cores, start=1):
        cronometro = Cronometro(cor_fundo, cor_texto)
        cronometro.setGeometry(5, 963 + (i - 1) * 28, 75, 25)
        cronometro.show()
        cronometros[str(i)] = cronometro

    flask_thread = Thread(target=run_flask_server)
    flask_thread.start()

    sys.exit(app.exec_())


# #### INICIAR CRONOMETRO (A PARTIR DESSE PRÓPRIO ARQUIVO)
if __name__ == "__main__":
    stopwatchRun()
