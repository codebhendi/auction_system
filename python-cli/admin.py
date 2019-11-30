from seller import separate, categories, bidder_array, seller_array

def add_category():
    while True:
        separate()
        input_val = input('Enter category or -1 to go back: ')
        if input_val == '-1':
            break
        elif input_val == '':
            print('Incorrect value')
            continue
        else:
            categories.append(input_val)
            break

def get_all_bidders():
    separate()
    print('Printing all the bidders')

    for i in bidder_array:
        print(i)
    
    while True:
        separate()
        print('Enter id of the user to block or -1 to go back')
        input_val = input('Enter :')

        if input_val == '-1':
            break
        else:
            try:
                bidder_array[int(input_val)]['id'] = -1
                print('User blocked')
                break
            except:
                print('Incorrect entry')


def get_all_categories():
    separate()

    for i in categories:
        print(i)
        print('-----\n')


def get_all_sellers():
    separate()
    print('Printing all the sellers')

    for i in bidder_array:
        print(i)
    
    while True:
        separate()
        print('Enter id of the user to block or -1 to go back')
        input_val = input('Enter :')

        if input_val == '-1':
            break
        else:
            try:
                seller_array[int(input_val)]['id'] = -1
                print('User blocked')
                break
            except:
                print('Incorrect entry')


def admin_interface():
    while True:
        separate()

        print('Enter admin id to use admin interface or 2 to get back: ')
        input_val = input('Enter :')

        if input_val == '2':
            return
        elif input_val != 'admin_id':
            print('Incorrect option')
            continue
        print('Logged In')
        break
    
    while True:
        separate()
        print('choose one of the following options')
        print('1. Get All Bidders\n2. Get All Sellers\n.3. Get all categories\n4. Add a category\n5. Get Back')
        input_val = input('Enter :')

        if input_val == '5':
            break
        elif input_val == '1':
            get_all_bidders()
        elif input_val == '2':
            get_all_sellers()
        elif input_val == '3':
            get_all_categories()
        elif input_val == '4':
            add_category()
        else:
            print('Invalid input')
