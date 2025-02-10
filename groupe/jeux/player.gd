extends CharacterBody2D

@export var speed: float = 200  # Vitesse du joueur
var grabbed_object = null  # Stocke l'objet pris
@onready var grab_area = $GrabArea  # La zone de détection de l'objet à ramasser
@onready var sprite = $AnimatedSprite2D
var mouvement
func _process(delta):
	var direction = Vector2.ZERO  # Vecteur de direction
	mouvement=false
	if Input.is_action_pressed("move_up"):
		direction.y -= 1
		mouvement=true
		sprite.play("up")
	if Input.is_action_pressed("move_down"):
		direction.y += 1
		mouvement=true
		sprite.play("down")
	if Input.is_action_pressed("move_left"):
		direction.x -= 1
		mouvement=true
		sprite.play("left")
	if Input.is_action_pressed("move_right"):
		direction.x += 1
		mouvement=true
		sprite.play("right")

	if direction != Vector2.ZERO:
		direction = direction.normalized()
		
		
	velocity = direction * speed
	move_and_slide()
	
	# Limiter le joueur à l'écran
	var screen_size = get_viewport_rect().size  # Taille de la fenêtre
	global_position.x = clamp(global_position.x, 0, screen_size.x)
	global_position.y = clamp(global_position.y, 0, screen_size.y)

	# Si on a un objet pris, on le déplace avec le joueur
	if grabbed_object:
		grabbed_object.global_position = self.global_position + Vector2(10, -10)
	check_movement()
	
func check_movement():
	if mouvement:
		pass
	else:
		sprite.play("idle")  # Arrête l'animation si le joueur ne bouge plus
		
		
		
func _input(event):
	if event.is_action_pressed("grab_object"):  # Lorsque le joueur appuie sur "E"
		if grabbed_object:
			# Vérifier si l'objet est dans une zone "feu" avant de le relâcher
			for area in grab_area.get_overlapping_areas():
				if area.is_in_group("feu"):
					area.store_id(grabbed_object.get_id())
					
					print("L'objet avec l'ID", grabbed_object.get_id(), "a été supprimé.")
					grabbed_object.queue_free()  # Supprimer l'objet
					grabbed_object = null
					var validation= area.check_validity()
					if validation:
						spawn_plat(area)
					else:
						print("rien")
					return  # Quitte la fonction pour éviter de relâcher l'objet normalement
				elif area.is_in_group("rendre"):
					if grabbed_object.is_in_group("plat"):
						grabbed_object.queue_free()  # Supprimer l'objet
						grabbed_object = null
						print("rendu")
						return
					return
			# Relâcher l'objet si ce n'est pas dans le groupe "feu"
			print("Objet relâché :", grabbed_object.name)
			grabbed_object = null
		else:
			# Vérifier les objets dans la zone de détection
			for area in grab_area.get_overlapping_areas():
				if area.is_in_group("deplacable"):
					grabbed_object = area
					print("Objet attrapé :", grabbed_object.name)
				if area.is_in_group("interactable"):
					# Instancier un nouvel objet à la position de la boîte
					spawn_object(area)
					break  # Quitte la boucle après avoir interagi avec une boîte

func spawn_object(boite):
	# Vérifie si un objet est déjà pris
	if grabbed_object != null:
		return
	
	# Instancie un nouvel objet à partir de la scène Objet.tscn
	if boite.object_node:
		if boite.object_node.count > 0:
			var new_object = boite.object_node.duplicate()  
			new_object.set_id(boite.object_node.get_id())
			boite.object_node.moins()
			
			new_object.global_position = boite.global_position  # Place l'objet à la position de la boîte
			get_tree().current_scene.add_child(new_object)  # Ajoute l'objet à la scène
			new_object.add_to_group("deplacable")
			# Rendre l'objet déplaçabled
			grabbed_object = new_object

func spawn_plat(pot):
	# Vérifie si un objet est déjà pris
	if grabbed_object != null:
		return
	await get_tree().create_timer(5.0).timeout
	# Instancie un nouvel objet à partir de la scène Objet.tscn
	if pot.plat_node:
		var new_object = pot.plat_node[0].duplicate()  
		new_object.set_id(pot.plat_node[0].get_id())
		
		new_object.global_position = pot.global_position+ Vector2(8, 10)  # Place l'objet à la position de la boîte
		get_tree().current_scene.add_child(new_object)  # Ajoute l'objet à la scène
		new_object.add_to_group("deplacable")
		new_object.add_to_group("plat")
