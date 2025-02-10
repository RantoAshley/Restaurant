extends Area2D
@export var object_node: Node
var receive: int
func _ready():
	add_to_group("interactable")
