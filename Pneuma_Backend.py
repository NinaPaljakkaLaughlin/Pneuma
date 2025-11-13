from flask import Flask 

app = Flask(__name__)

emotion_timer = {
    "unfocused": 10,
    "angry": 15,
    "stressed": 20, 
    "tired": 25,
    "happy": 30,
    "confident": 45,
    "energetcic": 55
}

@app.route("/mood", methods = ["GET", "POST"])
def mood_reader(): 
    study_time = none 
    if request.method == "Post":
        emotion = request.form.get("emotion")
        study_time = emotion_timer.get(emotion.lower(), 30)
    return render_template("index.html", study_time=study_time)

rewards = {
    "Movie Night": 20, 
    "New Book": 30, 
    "Clothes": 40,
    "New Game": 70, 
    "Concert": 100, 
    "Travel" : 500, 
}

rest = {
    "energetic": 15, 
    "confident": 20,
    "happy": 25, 
    "tired": 30, 
    "stressed": 40,
    "angry": 45, 
    "unfocused": 55, 
}
@app.route("/rest", methods =["GET", "POST"])
def rest_amount(): 
    if request.method == "Post"
        emotion = request.form.get("emotion")
        rest_time = rest_times.timer.get(emotion.lower(), 30)
    return render_template("index.html", rest=rest_time)

@app.route("/experience", methods=["GET", "POST"])
def experience(): 
    study_time = None
    earned_reward = None

    if "xp" not in session: 
        session["xp"] = 0
    if request.method == "Post": 
        emotion = request.form.get("emotion")
        study_time = emotion_timer.get(emotion.lower(), 30)
        
        session["xp"] += 1

        if session["xp"] in rewards: 
            eared_reward = rewards[session["xp"]]
    return render_template("index.html", study_time=study_time, xp=session["xp"], earned_reward = earned_reward)

@app.route("/")
def home(): 
    return "Welcome to Pneuma!/n A Place to Catch Your Breathe."   

@app.route("/experience")
if __name__ == "_main":
    app.run()