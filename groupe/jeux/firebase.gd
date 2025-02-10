extends Node

var firebase = null

func _ready():
    firebase = get_node("/root/Firebase")
    if firebase == null:
        print("Firebase n'est pas chargé 🚨")
        return

    # Lancer l'authentification Firebase
    firebase.auth.connect("login_succeeded", self, "_on_login_success")
    firebase.auth.connect("login_failed", self, "_on_login_fail")
    
    # Se connecter anonymement
    firebase.auth.login_anonymous()

func _on_login_success():
    print("Connexion Firebase réussie 🎉")

func _on_login_fail(error):
    print("Erreur de connexion Firebase :", error)
