import praw, datetime, requests, json, time, numpy as np, pandas as pd
import tensorflow


reddit = praw.Reddit(client_id = open('client_id.txt').read(),              # id cliente
                      client_secret = open('client_secret.txt').read(),     # secret cliente
                      user_agent = open('user_agent.txt').read(),           # nombre agent,
                      username = open('username.txt').read(),               # nombre usuario reddit
                      password = open('password.txt').read(),)              # contraseña usuario reddit

subreddit = reddit.subreddit('python')

top_posts = subreddit.top(limit=10)
new_posts = subreddit.new(limit=5)

for post in top_posts:
    print("Titulo - ", post.title )
    print("ID - ", post.id )
    print("Autohor - ", post.author )
    print("URL - ", post.url )
    print("Score - ", post.score )
    print("Comment count - ", post.num_comments )
    print("Created - ", post.created_utc )
    print("\n")

post = reddit.submission(url="https://www.reddit.com/r/Honduras/comments/1833ojr/personas_a_las_que_les_han_prohibido_entrar_a/")

comments = post.comments
palabras_removidas = ['[removed]','[deleted]']
comentarios = []

for comment in comments[:2]:
    print("Imprimiendo comentario...")
    print("Cuerpo del comentario - ",comment.body)
    if ((str(comment.body)) not in palabras_removidas ):
        comentarios.append(str(comment.body))

df = pd.DataFrame(comentarios)
df.to_csv('ListaDeComentarios.csv',index=True)
print(comentarios)
