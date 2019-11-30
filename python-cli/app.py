from seller import seller_interface, separate
from bidder import bidder_interface
from admin import admin_interface

def permanent_loop():
    while True:
        try:
            separate()
            print('Chose one of the use role you want to login as')
            print('''
                1. Admin
                2. Seller
                3. Buyer
                4. Exit
            ''')
            input_val = input("Enter input :")

            if input_val == '1':
                admin_interface()
            elif input_val == '2':
                seller_interface()
            elif input_val == '3':
                bidder_interface()
            elif input_val == '4':
                break
        except Exception as e:
            print(e)
            print('Please enter 4 to exit')

if __name__ == '__main__':
    print('Welcome to auction system')
    print('Enter exit to exit anytime')
    permanent_loop()
