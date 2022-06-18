import sqlite3
import random

con = sqlite3.connect('database.sql')

cur = con.cursor()


def random_name()->str:
    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'
               'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    return f'{letters[random.randint(0, len(letters)-1)]}{letters[random.randint(0, len(letters)-1)]}' \
           f'{letters[random.randint(0, len(letters)-1)]}{letters[random.randint(0, len(letters)-1)]}'


def random_age()->int:
    return random.randint(20, 55)

def random_salary():
    return random.randint(30000, 103000)


for i in range(1, 1000):
    name = random_name()
    age = random_age()
    salary = random_salary()

    cur.execute(f"INSERT INTO Employees(name, age, salary) VALUES('{name}', {age}, {salary})")

cur.close()
con.commit()