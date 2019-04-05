# WHAMo -- Johnny Wong, Hasif Ahmed, Matthew Ming, Addison Huang
# SoftDev2 - pd8
# P04

import os, csv
from flask import Flask, render_template, redirect, url_for, session, request, flash, get_flashed_messages


#============instantiate Flask object================
app = Flask(__name__)
app.secret_key = os.urandom(32)


@app.route('/')
def index():
    return render_template('bubble.html')

@app.route('/streets')
def streets():
    input_file = csv.reader(open("static/newdata.csv"))
    next(input_file)
    return render_template('streets.html', data = input_file)

if __name__ == '__main__':
    app.debug = True
    app.run()
