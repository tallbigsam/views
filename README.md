**VIEWS**

There's a script which generates sample data, it can also generate historic data. generate_order_data.py

Use the sample data to then showcase the possibilities in create_view.mongodb.js - make sure you create a custom role in atlas.

Use store_admin.py to highlight that you can't perform data write tasks when using the custom role. But you can query the view for your store. 

**TRIGGERS**

I've generated a scheduled trigger which will get a report of incomplete picks on the stores, regen each min, but obvs more realistically might be the ten minute mark. see trigger.js

**FLE/SECURITY**
See my other repo on my github.
