import praw, datetime, requests, json, time, numpy as np, pandas as pd

reddit = praw.Reddit(client_id = open('client_id.txt').read(),              # id cliente
                      client_secret = open('client_secret.txt').read(),     # secret cliente
                      user_agent = open('user_agent.txt').read(),           # nombre agent,
                      username = open('username.txt').read(),               # nombre usuario reddit
                      password = open('password.txt').read(),)              # contraseña usuario reddit

subreddit = reddit.subreddit('python')
palabras_removidas = ['[removido]','[eliminado]']

top_posts = subreddit.top(limit=15)
new_posts = subreddit.new(limit=5)

comentarios = []

for post in top_posts:
    # print("Titulo - ", post.title )
    print("ID - ", post.id )
    post = reddit.submission(id=post.id)
    comments = post.comments
    for comment in comments[:5]:
        if ((str(comment.body)) not in palabras_removidas ):
            comentarios.append(str(comment.body))
    # print("Autohor - ", post.author )
    # print("URL - ", post.url )
    # print("Score - ", post.score )
    # print("Comment count - ", post.num_comments )
    # print("Created - ", post.created_utc )
    # print("\n")


df = pd.DataFrame(comentarios,columns=['comentarios'])
df.to_csv('ListaDeComentarios.csv',index=False)
