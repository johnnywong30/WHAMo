# WHAMo -- Johnny Wong, Hasif Ahmed, Matthew Ming, Addison Huang
# SoftDev2 - pd8
# P04

import os

from flask import Flask, render_template, redirect, url_for, session, request, flash, get_flashed_messages


#============instantiate Flask object================
app = Flask(__name__)
app.secret_key = os.urandom(32)


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.debug = True
    app.run()
