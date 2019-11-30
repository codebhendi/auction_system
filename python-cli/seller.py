categories = ['electronic', 'commodity', 'stationery']
seller_array = [{ 'username': 'shubham', 'id': 0 }]
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
bidder_array = [{ 'username': 'bidder', 'id': 0 }]
bid_log_array = [{ 'price': 1001, 'item_id': 0, 'bidder_id': 0 }, { 'price': 1010, 'item_id': 0, 'bidder_id': 0 }]


def separate():
    print('\n\n--------')

def item_options(id):
    print(item)
    print('\n\nChoose one of the options')
    print('\n1. Get current bids\n2. Get highest bids\n3. Stop bidding\n4. Print Invoice\n5. Go back')

    while True:
        high_val_bid = { 'price': -1 }

        for i in bid_log_array:
            if i['item_id'] == item['id'] and i['price'] > high_val_bid['price']:
                high_val_bid = i
                
        separate()
        input_val = input("Enter an option :")

        if input_val == '5':
            break
        elif input_val == '1':
            for i in bid_log_array:
                if i['item_id'] == item['id']:
                    print(i)
        elif input_val == '2':
            if high_val_bid['price'] == -1:
                print('No bids made ye')
            else:
                print(high_val_bid)
        elif input_val == '3':
            if item['sold'] == True:
                print('Bidding already stopped')
                continue

            separate()
            while True:
                ans = input("Are you sure you want to sell this item?(y/n)")
                if ans == 'n':
                    break
                elif ans == 'y':
                    item['sold'] = True
                    if high_val_bid['price'] == -1:
                        item['selling_price'] = None 
                        item['bidder_id'] = None
                    else:
                        item['selling_price'] = high_val_bid['price']
                        item['bidder_id'] = high_val_bid['bidder_id']
                    print('item selling done')
                    break
        elif input_val == '4':
            if item['sold'] == True:
                print(item)
            else:
                print('To print invoice stop bid on item.')
        else:
            print('Incorrect input')
                

def get_all_items(id):
    separate()
    print('Choose one of the items')

    for i in item_array:
        if (i['seller_id'] == id):
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
            separate()
            item_options(id, item)
        except Exception as e:
            print(e)
            print('Error in input')
            continue


def login_user():
    while True:
        separate()
        user = None
        try:
            val = int(input('Enter user id :'))
            user = seller_array[val]

            if user['id'] != val:
                print('User blocked for fraudulent activity')
                return '-1', '-1'
        except:
            continue
        print('Logged in')
        return user['username'], val


def user_register():
    separate()
    id = len(seller_array)
    print('Your user id is {id}'.format(id=id))
    username = None
    while True:
        separate()
        username = input('Enter username :')
        if username == '':
            print('Incorrect username')
            continue
        else:
            seller_array.append({ 'id': id, 'username': username })
            print('User registered')
            break
    return username, id


def add_item(id):
    separate()
    print('Enter following details')
    name = None
    description = None
    starting_price = None
    category = None

    while True:
        if not name:
            name = input('Enter name :')
            if not name:
                continue

        if not description:
            description = input('Enter description :')
            if not description:
                continue

        if not starting_price:
            try:
                starting_price = int(input('Enter starting price :'))
                if not starting_price or starting_price <= 0:
                    continue
            except:
                continue

        if not category:
            print('Choose one of the category :')
            for i in range(len(categories)):
                print('{index}. {category}'
                    .format(index=i, category=categories[i]))

            category = categories[int(input('Enter cat :'))]
        break

    print('Item id is {id}'.format(id=len(item_array)))
    item_array.append({
        'name': name,
        'description': description,
        'starting_price': starting_price,
        'selling_price': None,
        'bidder_id': None,
        'seller_id': id,
        'id': len(item_array),
        'sold': False,
    })
    print('Bidding has started for this item')


def seller_interface():
    print('Choose one of the options for seller')
    print('1. Login\n2. Register\n3. Go back\n')
    username = None
    id = None

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

    print('Welcome {user}'.format(user=username))
    seller = seller_array[id]

    while True:
        separate()
        print('Choose one of the options')
        print('1. Add Item\n2. Get Added Items\n3. Go back\n')
        input_val = input('Enter input :')
        if input_val == '2':
            get_all_items(id)
        elif input_val == '1':
            add_item(id)
        elif input_val == '3':
            break
        else:
            print('incorrect option')
            continue
