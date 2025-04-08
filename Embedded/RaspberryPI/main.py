from camera import take_picture
from stream import start_video_stream

if __name__ == "__main__":

    choice = input("What do you want to do?\n1: Capture image\n2: Start videostream\n> ")

    if choice == "1":
        take_picture()
    elif choice == "2":
        start_video_stream()
    else:
        print("Ogiltigt val.")
