import threading
import numpy as np

matrix = np.zeros((3, 3), dtype=int)

def in_thread(num):
    for i in range(3):
        matrix[num][i] = num
    print('{}. thread done'.format(num))


if __name__ == "__main__": 
    # creating thread 
    threads = []
    for i in range(3):
        threads.append(threading.Thread(target=in_thread, args=(i,)))

    print('before')
    for i in range(3):
        threads[i].start()

    for i in range(3):
        threads[i].join()

    print('done')

    print(matrix)