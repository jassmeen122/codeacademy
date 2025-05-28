
import { Challenge } from "@/types/codingChallenge";

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Tuple et Mutabilité",
    description: "Que renvoie ce code et pourquoi ?",
    code: `a = (1, 2, [3, 4])
a[2] += [5]
print(a)`,
    correctAnswer: "TypeError mais a est modifié",
    explanation: "Le tuple contient une liste mutable. L'opération += modifie la liste mais lève une TypeError car on essaie de réassigner dans un tuple.",
    type: 'python'
  },
  {
    id: 2,
    title: "Closure et Variable Locale",
    description: "Quel est le problème ici ?",
    code: `def make_counter():
    count = 0
    def counter():
        count += 1
        return count
    return counter`,
    correctAnswer: "UnboundLocalError",
    explanation: "L'opérateur += tente de lire count avant de l'assigner, mais Python considère count comme une variable locale non initialisée. Il faut utiliser 'nonlocal count'.",
    type: 'python'
  },
  {
    id: 3,
    title: "Argument par Défaut Mutable",
    description: "Que fait cette fonction exactement ?",
    code: `def func(x=[]):
    x.append(1)
    return x

print(func())
print(func())
print(func())`,
    correctAnswer: "Accumule les valeurs",
    explanation: "L'argument par défaut [] est créé une seule fois. Chaque appel modifie la même liste, causant une accumulation des valeurs : [1], [1,1], [1,1,1].",
    type: 'python'
  },
  {
    id: 4,
    title: "Paramètres Positional-Only",
    description: "Que fait ce code ?",
    code: `def f(x, y, /, z):
    return x + y + z

# f(1, 2, 3)     # OK
# f(x=1, y=2, z=3)  # Erreur`,
    correctAnswer: "/ sépare positional-only",
    explanation: "Le symbole / indique que x et y doivent être passés uniquement par position, pas par nom. Seul z peut être passé par nom.",
    type: 'python'
  },
  {
    id: 5,
    title: "Slots et Attributs Dynamiques",
    description: "Peut-on modifier un objet défini avec __slots__ ?",
    code: `class Test:
    __slots__ = ['a']
    def __init__(self):
        self.a = 1

t = Test()
t.b = 2  # Que se passe-t-il ?`,
    correctAnswer: "AttributeError",
    explanation: "__slots__ limite les attributs aux noms spécifiés et empêche la création d'un __dict__. Ajouter un attribut non défini lève AttributeError.",
    type: 'python'
  },
  {
    id: 6,
    title: "Méthodes Magiques getattr",
    description: "Quelle est la sortie ?",
    code: `class A:
    def __init__(self):
        self.x = 1
    def __getattr__(self, name):
        return 42

a = A()
print(a.x)
print(a.y)`,
    correctAnswer: "1 puis 42",
    explanation: "__getattr__ n'est appelé que si l'attribut n'existe pas. a.x existe (1), a.y n'existe pas donc __getattr__ retourne 42.",
    type: 'python'
  },
  {
    id: 7,
    title: "Métaclasses et Type",
    description: "Quelle est la différence entre ces deux appels ?",
    code: `print(type(type))
print(type(object))`,
    correctAnswer: "<class 'type'> deux fois",
    explanation: "type est une métaclasse, instance d'elle-même. object est la classe de base, instance de type. Donc type(type) et type(object) retournent tous deux <class 'type'>.",
    type: 'python'
  },
  {
    id: 8,
    title: "Opérations Booléennes",
    description: "Que produit cette expression ?",
    code: `result = (True * False) ** True + False
print(result)
print(type(result))`,
    correctAnswer: "0 de type int",
    explanation: "True=1, False=0 en arithmétique. (1*0)**1 + 0 = 0**1 + 0 = 0 + 0 = 0. Le résultat est un int car les opérations arithmétiques convertissent les bool en int.",
    type: 'python'
  },
  {
    id: 9,
    title: "Références et Slicing",
    description: "Que se passe-t-il ici ?",
    code: `a = [1, 2, 3]
b = a
a[:] = []
print(b)`,
    correctAnswer: "[] - liste vide",
    explanation: "b et a référencent la même liste. a[:] = [] modifie le contenu de la liste existante (ne crée pas une nouvelle liste), donc b est aussi affecté.",
    type: 'python'
  },
  {
    id: 10,
    title: "Décorateur Mémoization",
    description: "Que fait ce décorateur ?",
    code: `def memoize(f):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = f(*args)
        return cache[args]
    return wrapper`,
    correctAnswer: "Met en cache les résultats",
    explanation: "Mémoization : stocke les résultats des appels de fonction pour éviter les recalculs. Limitation : ne fonctionne qu'avec des arguments hashables (pas de listes/dict).",
    type: 'python'
  },
  {
    id: 11,
    title: "Comparaison NULL",
    description: "Quelle est la sortie de cette requête et pourquoi ?",
    code: `SELECT NULL = NULL;`,
    correctAnswer: "NULL (pas TRUE)",
    explanation: "En SQL, NULL représente l'absence de valeur. Comparer NULL avec quoi que ce soit (même NULL) retourne NULL, pas TRUE. Il faut utiliser IS NULL pour tester la nullité.",
    type: 'sql'
  },
  {
    id: 12,
    title: "Requête Récursive",
    description: "Que fait cette requête récursive ?",
    code: `WITH RECURSIVE cnt(x) AS (
  SELECT 1
  UNION ALL
  SELECT x + 1 FROM cnt WHERE x < 5
)
SELECT * FROM cnt;`,
    correctAnswer: "Génère les nombres 1 à 5",
    explanation: "CTE récursive : commence par SELECT 1, puis ajoute x+1 tant que x<5. Résultat : 1, 2, 3, 4, 5. La récursivité s'arrête quand la condition WHERE devient fausse.",
    type: 'sql'
  },
  {
    id: 13,
    title: "LEFT JOIN vs FULL OUTER JOIN",
    description: "Quelle est la différence entre LEFT JOIN et FULL OUTER JOIN ?",
    code: `-- LEFT JOIN : garde toutes les lignes de la table de gauche
-- FULL OUTER JOIN : garde toutes les lignes des deux tables
SELECT * FROM table1 LEFT JOIN table2 ON ...
-- vs
SELECT * FROM table1 FULL OUTER JOIN table2 ON ...`,
    correctAnswer: "FULL garde toutes les lignes",
    explanation: "LEFT JOIN garde toutes les lignes de la table de gauche + les correspondances. FULL OUTER JOIN garde toutes les lignes des deux tables, même sans correspondance (avec NULL).",
    type: 'sql'
  },
  {
    id: 14,
    title: "Fonction Fenêtre OVER",
    description: "Que fait cette requête ?",
    code: `SELECT department_id, AVG(salary) OVER (PARTITION BY department_id)
FROM employees;`,
    correctAnswer: "Moyenne par département",
    explanation: "OVER (PARTITION BY ...) calcule AVG(salary) pour chaque département séparément, tout en gardant toutes les lignes individuelles. Différent de GROUP BY qui agrège les lignes.",
    type: 'sql'
  },
  {
    id: 15,
    title: "Contrainte CHECK",
    description: "Que signifie cette contrainte ?",
    code: `CHECK (salary > 0 AND salary < 99999)`,
    correctAnswer: "Valide les valeurs de salary",
    explanation: "CHECK valide que salary est entre 0 et 99999. Peut être contournée en désactivant les contraintes ou avec des privilèges admin. NULL passe toujours les contraintes CHECK.",
    type: 'sql'
  },
  {
    id: 16,
    title: "Transaction et Crash",
    description: "Que se passe-t-il ici ?",
    code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- crash du système ici
COMMIT;`,
    correctAnswer: "Transaction annulée (ROLLBACK)",
    explanation: "Si le système crash avant COMMIT, la transaction est automatiquement annulée (ROLLBACK). En autocommit, chaque instruction est commitée immédiatement.",
    type: 'sql'
  },
  {
    id: 17,
    title: "Injection SQL",
    description: "Pourquoi cette requête est-elle dangereuse ?",
    code: `SELECT * FROM users WHERE name = 'John' OR 1=1;`,
    correctAnswer: "Injection SQL - retourne tout",
    explanation: "OR 1=1 est toujours vrai, donc retourne tous les utilisateurs. Injection SQL classique. Solution : requêtes préparées avec paramètres liés (prepared statements).",
    type: 'sql'
  },
  {
    id: 18,
    title: "EXISTS vs IN",
    description: "Que fait cette requête ?",
    code: `SELECT * FROM orders o
WHERE EXISTS (
  SELECT 1 FROM customers c WHERE c.id = o.customer_id AND c.status = 'VIP'
);`,
    correctAnswer: "Commandes de clients VIP",
    explanation: "EXISTS teste l'existence d'au moins une ligne. Plus efficace que IN pour les grosses tables. EXISTS s'arrête dès qu'une ligne est trouvée, IN doit tout évaluer.",
    type: 'sql'
  },
  {
    id: 19,
    title: "COUNT et NULL",
    description: "Quelle est la différence ?",
    code: `SELECT COUNT(*), COUNT(column_name) FROM table_name;`,
    correctAnswer: "COUNT(*) compte tout, COUNT(col) ignore NULL",
    explanation: "COUNT(*) compte toutes les lignes. COUNT(column_name) ignore les valeurs NULL dans cette colonne. Important pour les statistiques avec des données manquantes.",
    type: 'sql'
  },
  {
    id: 20,
    title: "Vue Matérialisée",
    description: "Qu'est-ce qu'une vue matérialisée ?",
    code: `CREATE MATERIALIZED VIEW sales_summary AS
SELECT region, SUM(amount) as total
FROM sales GROUP BY region;

-- vs vue normale :
CREATE VIEW sales_view AS SELECT ...`,
    correctAnswer: "Vue stockée physiquement",
    explanation: "Vue matérialisée : résultats stockés physiquement, rapide à lire mais doit être rafraîchie. Vue normale : recalculée à chaque accès, toujours à jour mais plus lente.",
    type: 'sql'
  },
  {
    id: 21,
    title: "Comparaisons PHP Bizarres",
    description: "Que renvoie ce code, et pourquoi ?",
    code: `$a = "0";
$b = 0;
$c = false;

var_dump($a == $b);
var_dump($b == $c);
var_dump($a == $c);`,
    correctAnswer: "true, true, false",
    explanation: "PHP fait du type juggling : '0' == 0 (string vers int), 0 == false (int vers bool), mais '0' != false car la conversion directe string-bool donne true pour toute string non-vide.",
    type: 'php'
  },
  {
    id: 22,
    title: "Destructeur et Variables Statiques",
    description: "Quelle est la sortie, et pourquoi ?",
    code: `class A {
    public function __destruct() {
        echo "Bye";
    }
}

function test() {
    static $a = new A();
}

test();
echo "End";`,
    correctAnswer: "End puis Bye",
    explanation: "Les variables statiques persistent pendant toute l'exécution du script. Le destructeur n'est appelé qu'à la fin du script, après 'End'. L'objet reste en mémoire car il est statique.",
    type: 'php'
  },
  {
    id: 23,
    title: "Retour par Référence Dangereux",
    description: "Pourquoi cette fonction ne renvoie pas ce que l'on attend ?",
    code: `function &getValue() {
    $value = 42;
    return $value;
}

$a = &getValue();`,
    correctAnswer: "Référence vers variable locale détruite",
    explanation: "Retour par référence d'une variable locale : $value est détruite à la fin de la fonction, laissant $a avec une référence invalide. Cause un avertissement et un comportement imprévisible.",
    type: 'php'
  },
  {
    id: 24,
    title: "Modification de String par Index",
    description: "Que se passe-t-il ici ?",
    code: `$a = '1';
$a[1] = '2';
echo $a;`,
    correctAnswer: "12",
    explanation: "PHP étend automatiquement la string quand on assigne à un index. $a[0]='1' existe, $a[1]='2' est ajouté. Résultat : '12'. Comportement unique à PHP parmi les langages populaires.",
    type: 'php'
  },
  {
    id: 25,
    title: "Méthodes Magiques PHP",
    description: "Que fait réellement cette classe ?",
    code: `class Magic {
    public function __call($name, $args) {
        echo "Call $name";
    }
    public function __get($name) {
        echo "Get $name";
    }
    public function __set($name, $value) {
        echo "Set $name = $value";
    }
}

$magic = new Magic();
$magic->nonExistentMethod(1, 2);
echo $magic->prop;
$magic->other = 10;`,
    correctAnswer: "Call nonExistentMethod, Get prop, Set other = 10",
    explanation: "__call() intercepte les méthodes inexistantes, __get() les propriétés lues, __set() les assignations. Ordre d'exécution : call, get, set. Ces méthodes permettent la programmation dynamique en PHP.",
    type: 'php'
  },
  {
    id: 26,
    title: "Variable Final Non Initialisée",
    description: "Pourquoi ce code ne compile-t-il pas ?",
    code: `public class Test {
    public static void main(String[] args) {
        final int x;
        System.out.println(x);
    }
}`,
    correctAnswer: "Variable final non initialisée",
    explanation: "Une variable final doit être initialisée avant utilisation. Ici, x est déclarée final mais jamais assignée avant d'être utilisée dans println(), causant une erreur de compilation.",
    type: 'java'
  },
  {
    id: 27,
    title: "Héritage et Liaison Dynamique",
    description: "Que fait ce code et quelle est la sortie ?",
    code: `class A {
    int x = 10;
    A() {
        this.x = 20;
        method();
    }
    void method() {
        System.out.println(x);
    }
}
class B extends A {
    int x = 30;
    B() {
        this.x = 40;
    }
    void method() {
        System.out.println(x);
    }
}
public class Main {
    public static void main(String[] args) {
        A a = new B();
    }
}`,
    correctAnswer: "Affiche 0",
    explanation: "Lors de la construction de B, le constructeur A() appelle method() de B avant que x de B soit initialisé. La variable x de B vaut 0 (valeur par défaut int) au moment de l'appel.",
    type: 'java'
  },
  {
    id: 28,
    title: "Deadlock avec Threads",
    description: "Que fait ce code avec les threads ?",
    code: `public class DeadlockDemo {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();

    public void method1() {
        synchronized(lock1) {
            synchronized(lock2) {
                System.out.println("method1");
            }
        }
    }

    public void method2() {
        synchronized(lock2) {
            synchronized(lock1) {
                System.out.println("method2");
            }
        }
    }
}`,
    correctAnswer: "Risque de deadlock",
    explanation: "Si deux threads appellent method1() et method2() simultanément, un deadlock peut survenir : thread1 prend lock1 puis attend lock2, thread2 prend lock2 puis attend lock1. Aucun ne peut continuer.",
    type: 'java'
  },
  {
    id: 29,
    title: "String Pool et Égalité",
    description: "Quel est le résultat et pourquoi ?",
    code: `String s1 = "hello";
String s2 = new String("hello");
System.out.println(s1 == s2);
System.out.println(s1.equals(s2));`,
    correctAnswer: "false puis true",
    explanation: "s1 référence le string pool, s2 crée un nouvel objet en heap. == compare les références (false), equals() compare le contenu (true). Utiliser equals() pour comparer les strings en Java.",
    type: 'java'
  },
  {
    id: 30,
    title: "NaN et ses Particularités",
    description: "Quelle est la sortie et pourquoi ?",
    code: `console.log(typeof NaN);
console.log(NaN === NaN);`,
    correctAnswer: "number et false",
    explanation: "NaN est de type 'number' mais représente 'Not a Number'. Particularité unique : NaN !== NaN (false). Pour tester NaN, utiliser Number.isNaN() ou Object.is(value, NaN).",
    type: 'javascript'
  },
  {
    id: 31,
    title: "Closure et Boucle",
    description: "Que fait ce code ?",
    code: `for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 100);
}`,
    correctAnswer: "Affiche 3 trois fois",
    explanation: "var a une portée de fonction, pas de bloc. Quand setTimeout s'exécute, la boucle est finie et i=3. Solution : utiliser let ou créer une closure avec une IIFE.",
    type: 'javascript'
  },
  {
    id: 32,
    title: "ASI et Return",
    description: "Que renvoie cette fonction ?",
    code: `function foo() {
    return
    {
        bar: "hello"
    };
}
console.log(foo());`,
    correctAnswer: "undefined",
    explanation: "Automatic Semicolon Insertion (ASI) : JavaScript insère automatiquement un ; après return, transformant le code en 'return;'. L'objet devient du code mort. Toujours mettre { sur la même ligne que return.",
    type: 'javascript'
  },
  {
    id: 33,
    title: "Références vs Valeurs",
    description: "Quelle est la sortie ?",
    code: `let a = [1, 2, 3];
let b = a;
a = [4, 5, 6];
console.log(b);`,
    correctAnswer: "[1, 2, 3]",
    explanation: "b référence le tableau original [1,2,3]. Quand a = [4,5,6], on change la référence de a vers un nouveau tableau, mais b garde sa référence vers l'ancien tableau.",
    type: 'javascript'
  },
  {
    id: 34,
    title: "Pointeurs et Modification",
    description: "Que va afficher ce code et pourquoi ?",
    code: `int a = 1;
int b = 2;
int *p = &a;
*p = b;
printf("%d %d\\n", a, b);`,
    correctAnswer: "2 2",
    explanation: "p pointe vers a. L'instruction *p = b; assigne la valeur de b (2) à la variable pointée par p (donc a). Donc a devient 2. b reste 2. Affichage : 2 2.",
    type: 'c'
  },
  {
    id: 35,
    title: "Chaîne Constante et Modification",
    description: "Que se passe-t-il ?",
    code: `char *str = "Hello";
str[0] = 'J';
printf("%s\\n", str);`,
    correctAnswer: "Comportement indéfini, segmentation fault",
    explanation: "str pointe vers une chaîne constante en mémoire en lecture seule. Modifier str[0] est interdit. Cela peut planter le programme avec une segmentation fault.",
    type: 'c'
  },
  {
    id: 36,
    title: "Pointeur vers Pointeur",
    description: "Que s'affiche ?",
    code: `int x = 5;
int *p = &x;
int **pp = &p;
**pp = 10;
printf("%d\\n", x);`,
    correctAnswer: "10",
    explanation: "pp est un pointeur vers un pointeur p. **pp = 10; modifie la valeur pointée par p, donc x devient 10.",
    type: 'c'
  },
  {
    id: 37,
    title: "Constructeur et Méthodes Virtuelles",
    description: "Que s'affiche et pourquoi ?",
    code: `class Base {
public:
    Base() { foo(); }
    virtual void foo() { std::cout << "Base\\n"; }
};

class Derived : public Base {
public:
    void foo() override { std::cout << "Derived\\n"; }
};

int main() {
    Derived d;
}`,
    correctAnswer: "Base",
    explanation: "Lors du constructeur Base(), l'objet est en cours de construction en tant que Base. La liaison virtuelle n'appelle pas la méthode Derived::foo(). Donc c'est Base::foo() qui est appelée.",
    type: 'cpp'
  },
  {
    id: 38,
    title: "Références rvalue et move",
    description: "Que s'affiche ?",
    code: `int main() {
    int a = 5;
    int& ref = a;
    int&& rref = std::move(ref);
    rref = 10;
    std::cout << a << std::endl;
}`,
    correctAnswer: "10",
    explanation: "rref est une référence rvalue vers a. Modifier rref modifie a.",
    type: 'cpp'
  },
  {
    id: 39,
    title: "Surcharge de Fonctions",
    description: "Quelle est la sortie ?",
    code: `void func(int x) { std::cout << "int\\n"; }
void func(int& x) { std::cout << "int&\\n"; }
int main() {
    int a = 1;
    func(a);
    func(1);
}`,
    correctAnswer: "int& puis int",
    explanation: "func(a) appelle la version par référence (car a est une variable modifiable). func(1) appelle la version par valeur (car 1 est une constante temporaire).",
    type: 'cpp'
  }
];
