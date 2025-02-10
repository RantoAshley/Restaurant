extends Area2D

@export var texture: Texture  # Permet de définir une texture différente pour chaque instance
@onready var sprite = $Sprite2D  # Assure-toi d’avoir un Sprite2D dans Objet.tscn


var id: int
static var id_counter: int = 0
var count: int = 6
signal id_donne(id)

func _init():
	# Assigner un ID même si l'objet n'est pas encore ajouté à la scène
	id = id_counter
	set_id(id)
	id_counter += 1

func _ready():
	add_to_group("deplacable")  # Ajoute l'objet au groupe "deplacable"
	if texture:
		sprite.texture = texture  # Applique la texture spécifiée

# Permet à un duplicata de copier l'ID de l'original
func get_id():
	return id

func moins():
	count=count-1
	print(count)

func set_id(new_id):
	id = new_id
	print("Idfinal=", id)
