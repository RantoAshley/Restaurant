extends Area2D
@export var plat_node: Array[Node]= []
var receive: int
var id1: int = -1  # L'ID à stocker (initialisé à -1)
var stored_ids: Array = []
func _ready():
	add_to_group("feu")

func store_id(id: int):
	if stored_ids.size() < 3:
		stored_ids.append(id)  # Ajoute l'ID à la fin du tableau
		print("tableau=", stored_ids)
	else:
		# Si le tableau a déjà 3 éléments, on enlève le premier et on ajoute le nouveau
		stored_ids=[]
		

func check_validity() -> bool:
	stored_ids.sort()
	# Condition : si les 3 éléments sont 1, 0, 0 dans n'importe quel ordre
	if stored_ids == [0, 1, 2]:
		print("Tableau validé")
		stored_ids=[]
		return true
	else:
		print("Tableau rejeté")
		return false

func setiding1(id: int):
	id1 = id  # Permet de définir l'ID
	print("Idfeu=", id1)

func getiding1():
	return id1  # Récupère l'ID
