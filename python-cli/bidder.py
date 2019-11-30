from seller import bid_log_array, item_array, bidder_array, separate

def place_bid(bidder_id, item, high_val):
    separate()
    print('Bidding for item {name} with {id}'.format(name=item['name'], id=item['id']))

    while True:
        separate()
        print('Enter -1 to go back else an integer for new price')
        input_val = input('Enter value :')

        if input_val == '-1':
            break

        try:
            val = int(input_val)

            if val > item['starting_price'] and val > high_val:
                bid_log_array.append({
                    'bidder_id': bidder_id,
                    'item_id': item['id'],
                    'price': val,
                })
                print('Bid placed')
                break
            else:
                print('Price too low. Must be greater than')
                if high_val == -1:
                    print('\t\t{}'.format(item['starting_price']))
                else:
                    print('\t\t{}'.format(high_val))
        except Exception as e:
            print(e)
            print('Error in input')


def item_bid_options(id, item):
    separate()
    print('Choose one of the options')

    while True:
        high_val_bid = { 'price': -1 }

        for i in bid_log_array:
            if i['price'] > high_val_bid['price'] and i['item_id'] == item['id']:
                high_val_bid = i

        separate()
        print('1. Place a bid\n2. Check out current highest bid.\n3. Check your bids.\n4. Go back')
        input_val = input('Enter an option :')

        if input_val == '1':
            place_bid(id, item, high_val_bid['price'])
        elif input_val == '2':
            if high_val_bid['price'] == -1:
                print('No bids placed yet')
            else:
                print(high_val_bid)
            print('-------\n')
        elif input_val == '3':
            for i in bid_log_array:
                if i['bidder_id'] == id and i['item_id'] == item['id']:
                    print(i)
            print('-------\n')
        elif input_val == '4':
            break
        else:
            print('Error in input')


def get_all_items(id):
    separate()
    print('Choose one of the items')

    for i in item_array:
        if (i['sold'] == False):
            print('Name of item: {}\nId of item: {}\n--------------'
            .format(i['name'], i['id']))

    while True:
        separate()
        print('Enter -1 to go back')
        input_val = input('Enter item id :')

        if input_val == '-1':
            break

        try:
            item = item_array[int(input_val)]
            print('Item obtained')
            item_bid_options(id, item)
        except Exception as e:
            print(e)
            print('Error in input')
            continue


def login_user():
    while True:
        separate()
        val = int(input('Enter user id :'))
        user = None

        try:
            user = bidder_array[val]
            if user['id'] !=  val:
                print('User has been blocked for fraudulent activity')
                return '-1', '-1'
        except:
            continue

        print('Logged in')
        return user['username'], val


def user_register():
    separate()
    id = len(bidder_array)
    print('Your user id is {id}'.format(id=id))

    username = None

    while True:
        separate()
        username = input('Enter username :')
        if username == '':
            print('Incorrect username')
            continue
        else:
            bidder_array.append({ 'id': id, 'username': username })
            print("Registered")
            break

    return username, id


def get_purchases(id):
    for i in item_array:
        if i['bidder_id'] == id and i['sold'] == True:
            print(i)
            separate()


def bidder_interface():
    separate()
    print('Choose one of the options for bidder')
    print('1. Login\n2. Register\n3. Go back\n')

    username = None

    while True:
        separate()
        input_val = input('Enter input :')
        if input_val == '2':
            username, id = user_register()
            break
        elif input_val == '1':
            username, id = login_user()
            break
        elif input_val == '3':
            return
        else:
            print('incorrect option')
            continue

    if username == '-1' and id == '-1':
        return

    separate()
    print('Welcome {user}'.format(user=username))
    bidder = bidder_array[id]

    while True:
        separate()
        print('Choose one of the options')
        print('1. Check Purcahses\n2. Check Items\n3. Go back\n')
        input_val = input('Enter input :')
        if input_val == '2':
            get_all_items(id)
        elif input_val == '1':
            get_purchases(id)
        elif input_val == '3':
            break
        else:
            print('incorrect option')
            continue
