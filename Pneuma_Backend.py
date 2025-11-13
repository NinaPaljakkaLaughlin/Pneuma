from flask import Flask, request, render_template, session, jsonify, redirect, url_for

app = Flask(__name__)
app.secret_key = "supersecretkey"

emotion_timer = {
    "unfocused": 10,
    "angry": 15,
    "anxious": 15,
    "stressed": 20, 
    "tired": 25,
    "calm": 30,
    "happy": 30,
    "confident": 45,
    "energetic": 55
}

# XP rewards based on difficulty
emotion_xp = {
    "unfocused": 5,
    "anxious": 4,
    "stressed": 4,
    "tired": 3,
    "calm": 2,
    "happy": 2,
    "confident": 2,
    "energetic": 1
}

rewards = {
    "movie": 20, 
    "book": 30, 
    "clothes": 40,
    "game": 70, 
    "concert": 100, 
    "travel": 500, 
}

@app.route("/")
def home(): 
    return render_template("index.html")

@app.route("/mood", methods=["GET", "POST"])
def mood_reader(): 
    study_time = None 
    if request.method == "POST":
        emotion = request.form.get("emotion")
        study_time = emotion_timer.get(emotion.lower(), 30)
        session["selected_mood"] = emotion.lower()
        session["study_time"] = study_time
        return jsonify({"study_time": study_time, "emotion": emotion})
    return render_template("mood.html")

@app.route("/session", methods=["GET", "POST"])
def session_page():
    if request.method == "POST":
        # Complete session and award XP
        emotion = session.get("selected_mood", "happy")
        xp_earned = emotion_xp.get(emotion, 2)
        
        if "total_xp" not in session:
            session["total_xp"] = 0
        
        session["total_xp"] += xp_earned
        session["last_xp_earned"] = xp_earned
        
        return jsonify({
            "xp_earned": xp_earned,
            "total_xp": session["total_xp"]
        })
    
    return render_template("session.html", 
                          study_time=session.get("study_time", 25),
                          mood=session.get("selected_mood", None))

@app.route("/finished", methods=["GET", "POST"])
def finished():
    if request.method == "POST":
        # Allocate XP to a reward
        reward_type = request.form.get("reward_type")
        cost = rewards.get(reward_type, 0)
        
        if "total_xp" not in session:
            session["total_xp"] = 0
        
        if session["total_xp"] >= cost:
            session["total_xp"] -= cost
            
            # Track reward counts
            if "rewards_earned" not in session:
                session["rewards_earned"] = {}
            
            if reward_type not in session["rewards_earned"]:
                session["rewards_earned"][reward_type] = 0
            
            session["rewards_earned"][reward_type] += 1
            
            return jsonify({
                "success": True,
                "remaining_xp": session["total_xp"],
                "reward_count": session["rewards_earned"][reward_type]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Not enough XP"
            })
    
    return render_template("finished.html",
                          total_xp=session.get("total_xp", 0),
                          last_xp=session.get("last_xp_earned", 0),
                          rewards_earned=session.get("rewards_earned", {}))

@app.route("/api/xp")
def get_xp():
    return jsonify({
        "total_xp": session.get("total_xp", 0),
        "last_xp_earned": session.get("last_xp_earned", 0)
    })

if __name__ == "__main__":
    app.run(debug=True)