import praw, datetime, requests, json, time, numpy as np, pandas as pd

def get_all_comments(submission, palabras_removidas, max_replies=5):   #Cargar comentarios
    submission.comments.replace_more(limit=1)
    comments = []

    for comment in submission.comments.list():
        if str(comment.body) not in palabras_removidas:
            comments.append(str(comment.body))
            replies = get_replies(comment, palabras_removidas, max_replies)
            comments.extend(replies)
    return comments

def get_replies(comment, palabras_removidas, max_replies): #Obtener los replies
    replies = []
    for i, reply in enumerate(comment.replies):
        if i >= max_replies:
            break
        if str(reply.body) not in palabras_removidas:
            replies.append(str(reply.body))
            replies.extend(get_replies(reply, palabras_removidas, max_replies))
    return replies

reddit = praw.Reddit(
    client_id=open('client_id.txt').read(),           # id cliente
    client_secret=open('client_secret.txt').read(),   # secret cliente
    user_agent=open('user_agent.txt').read(),         # nombre agent
    username=open('username.txt').read(),             # nombre usuario reddit
    password=open('password.txt').read(),             # contraseña usuario reddit
)

subreddit = reddit.subreddit('gaming')             #Nombre de subreddit del que se extraen datos
palabras_removidas = ['[removido]', '[eliminado]']

top_posts = subreddit.top(limit=1)                    #Limitar la cantidad de post 
comentarios = []

for post in top_posts:
    # print("Titulo - ", post.title )
    print("ID - ", post.id)
    comentarios.extend(get_all_comments(post, palabras_removidas, max_replies=5))
    # print("Autohor - ", post.author )
    # print("URL - ", post.url )
    # print("Score - ", post.score )
    # print("Comment count - ", post.num_comments )
    # print("Created - ", post.created_utc )
    # print("\n")


df = pd.DataFrame(comentarios, columns=['comentarios'])
df.to_csv('ListaDeComentarios.csv', index=False)

print(comentarios)                                    #Imprimir los comentarios en consola.