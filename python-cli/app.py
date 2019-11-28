from seller import seller_interface
from bidder import bidder_interface

def permanent_loop():
    seller_array = [{ 'username': 'shubham', id: 0 }]
    item_array = []
    item_array.append({
        'name': 'name',
        'description': 'description',
        'starting_price': 1000,
        'sold': False,
        'id': 0,
        'seller_id': 0,
        'bidder_id': None,
        'selling_price': None,
    })
    bidder_array = [{ 'username': 'bidder', id: 0 }]
    bid_log_array = [{ 'price': 1001, 'item_id': 0, 'bidder_id': 0 }, { 'price': 1010, 'item_id': 0, 'bidder_id': 0 }]

    while True:
        try:
            print('Chose one of the use role you want to login as')
            print('''
                1. Admin
                2. Seller
                3. Buyer
                4. Exit
            ''')
            input_val = input("Enter input :")
            print(input_val == 2, input_val == '2')
            if input_val == '2':
                seller_interface(seller_array, item_array, bid_log_array)
            elif input_val == '3':
                bidder_interface(bidder_array, item_array, bid_log_array)
        except Exception as e:
            print(e)
            print('Please enter exit to exit')

if __name__ == '__main__':
    print('Welcome to auction system')
    print('Enter exit to exit anytime')
    permanent_loop()
