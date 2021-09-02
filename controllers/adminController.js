const Category = require('./../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const Booking = require('../models/Booking');
const Member = require('../models/Member');

module.exports = {
    viewSignin: async (req, res) =>{
        try{
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert =  {message: alertMessage, status: alertStatus};
            if(req.session.user == null || req.session.user == undefined){
                res.render('index', {
                    alert,
                    title: 'Staycation | Login'
                });
            }else{
                res.redirect('/admin/dashboard');
            }

        }catch(error){
            res.redirect('/admin/signin');
        }
    },
    actionSignin: async(req, res)=>{
        try {
            const{username, password} = req.body;
            const user = await Users.findOne({username: username});
            if(!user){
                req.flash('alertMessage', 'Data user tidak terdaftar');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch){
                req.flash('alertMessage', 'Password tidak match');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }

            res.redirect('/admin/dashboard');
        } catch (error) {
            res.redirect('/admin/signin');
        }
    },
    actionLogout: (req, res) =>{
        req.session.destroy();
        res.redirect('/admin/signin');
    },
    viewDashboard: async (req, res) =>{
        try {
            const member = await Member.find();
            const booking = await Booking.find();
            const item = await Item.find(); 
            res.render('admin/dashboard/view-dashboard', {
                title: 'Staycation | Dashboard',
                user: req.session.user,
                member,
                booking,
                item
            });
            
        } catch (error) {
            res.redirect('/admin/dashboard');
        }
    },
    viewCategory: async (req, res) =>{
        try{
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert =  {message: alertMessage, status: alertStatus};
            res.render('admin/category/view-category', {
                category,
                alert,
                title: 'Staycation | Category',
                user: req.session.user
            });

        }catch(error){
            res.redirect('/admin/category');
        }
    },
    AddCategory: async(req, res) =>{
        try{
            req.flash('alertMessage', 'Success Add Data Category');
            req.flash('alertStatus', 'success');
            const {name} = req.body;
            await Category.create({name});
            res.redirect('/admin/category');
            //console.log(name);
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    EditCategory: async(req, res) =>{
        try{
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            const {id, name} = req.body;
            const category = await Category.findOne({_id: id});
            category.name = name;
            await category.save();
            res.redirect('/admin/category');
            //console.log(category);
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStstus', 'danger');
            res.redirect('/admin/category');
        }   
        },
    DeleteCategory: async(req, res) =>{
        try{
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            const {id} = req.params;
            const category = await Category.findOne({_id: id});
            await category.remove();
            res.redirect('/admin/category');

        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    viewBank: async(req, res) =>{
        try{
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert =  {message: alertMessage, status: alertStatus};
            res.render('admin/bank/view-bank', {
                title: 'Staycation | Bank',
                alert,
                bank,
                user: req.session.user
            });
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    AddBank: async(req, res) =>{
        try{
            const {name, nameBank, nomorRekening} = req.body;
            // console.log(req.file);
            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Data Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }

    }, 
    EditBank: async(req, res) =>{
        try {
            const {id, name, nameBank, nomorRekening} = req.body;
        const bank = await Bank.findOne({_id: id});
        if(req.file == undefined){
            bank.name = name;
            bank.nameBank = nameBank;
            bank.nomorRekening = nomorRekening;
            await bank.save();
            req.flash('alertMessage', 'Success Add Data Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        }else{
            await fs.unlink(path.join(`${bank.imageUrl}`));
            bank.name = name;
            bank.nameBank = nameBank;
            bank.nomorRekening = nomorRekening;
            bank.imageUrl = `images/${req.file.filename}`
            await bank.save();
            req.flash('alertMessage', 'Success update Data Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
        
    },
    DeleteBank: async(req, res) =>{
        try {
            const {id} = req.params;
            const bank = await Bank.findOne({_id: id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'Success delete Data Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    viewItem: async (req, res) =>{
        try {
            const item = await Item.find()
            .populate({path: 'imageId', select: 'id imageUrl'})
            .populate({path: 'categoryId', select: 'id name'});
            //console.log(item);
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert =  {message: alertMessage, status: alertStatus};
            res.render('admin/item/view-item', {
                title: 'Staycation | Item',
                category,
                alert,
                item,
                action: 'view',
                user: req.session.user
            });
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
  showImage: async (req, res) =>{
      try {
          const {id} = req.params;
        const item = await Item.findOne({_id: id})
        .populate({path: 'imageId', select: 'id imageUrl'})
        console.log(item.imageId);
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert =  {message: alertMessage, status: alertStatus};
        res.render('admin/item/view-item', {
            title: 'Staycation | Show Images',
            alert,
            item,
            action: 'show image',
            user: req.session.user
        });
      } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/bank');
      }
  },
  showEditItem: async (req, res) =>{
    try {
        const {id} = req.params;
      const item = await Item.findOne({_id: id})
      .populate({path: 'imageId', select: 'id imageUrl'})
      .populate({path: 'categoryId', select: 'id name'});
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert =  {message: alertMessage, status: alertStatus};
      res.render('admin/item/view-item', {
          title: 'Staycation | Edit Item',
          alert,
          item,
          category,
          action: 'edit',
          user: req.session.user
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
},
    
  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, about } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId,
          title,
          description: about,
          price,
          city
        }
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash('alertMessage', 'Success Add Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
  editItem: async (req, res) =>{
      try {
        const {id} = req.params;
        const { categoryId, title, price, city, about } = req.body;
        const item = await Item.findOne({_id: id})
        .populate({path: 'imageId', select: 'id imageUrl'})
        .populate({path: 'categoryId', select: 'id name'});
       if(req.files.length > 0 ){
           for(let i = 0; i < item.imageId.length; i++){
               const imageUpdate = await Item.findOne({_id: item.imageId[i]._id});
               await fs.unlink(path.join(`${imageUpdate.imageUrl}`));
               imageUpdate.imageUrl = `images/${req.files[i].filename}`;
               await imageUpdate.save();
           }
           item.title = title;
           item.price = price;
           item.city = city;
           item.description = about;
           item.categoryId = categoryId;
           await item.save();
           req.flash('alertMessage', 'Success Update Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
       } else{
           item.title = title;
           item.price = price;
           item.city = city;
           item.description = about;
           item.categoryId = categoryId;
           await item.save();
           req.flash('alertMessage', 'Success Update Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
       }

      } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
      }
  },
  deleteItem: async (req, res) =>{
      try {
          const {id} = req.params;
          const item = await Item.findOne({_id: id})
          .populate('imageId');
          for(let i = 0; i < item.imageId.length; i++){
              Image.findOne({_id: item.imageId[i]._id}).then((image) =>{
                  fs.unlink(path.join(`public/${image.imageUrl}`));
                  image.remove();
              }).catch((error) =>{
                req.flash('alertMessage', `${error.message}`);
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/item');
              });
          }
          await item.remove();
          req.flash('alertMessage', 'Success Delete Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
      }
  },
  viewDetailItem: async (req,res) =>{
      const { itemId } = req.params;
      try {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert =  {message: alertMessage, status: alertStatus};
        const feature = await Feature.find();
        const activity = await Activity.find();
        
        res.render('admin/item/detail-item/view-detail-item', {
            title: 'Staycation | Detail Item',
            alert,
            itemId,
            feature,
            activity,
            user: req.session.user
        });
      } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
  },
  AddFeature: async(req, res) =>{
    const {name, qty, itemId} = req.body;
    try{        
        if(!req.file){
            req.flash('alertMessage', 'Image not found');
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
        // console.log(req.file);
        const feature = await Feature.create({
            name,
            qty,
            itemId,
            imageUrl: `images/${req.file.filename}`
        });
        
        const item = await Item.findOne({_id: itemId});
        item.featureId.push({_id: feature._id});
        await item.save();
        req.flash('alertMessage', 'Success Add Data Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }

}, 
EditFeature: async(req, res) =>{
    const {id, name, qty, itemId} = req.body;
    try {
    const feature = await Feature.findOne({_id: id});
    if(req.file == undefined){
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash('alertMessage', 'Success Update Data Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }else{
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`
        await feature.save();
        req.flash('alertMessage', 'Success Update Data Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
    
},
DeleteFeature: async(req, res) =>{
    const {id, itemId} = req.params;
    try {
        const feature = await Feature.findOne({_id: id});
        const item = await (await Item.findOne({_id: itemId})).populate('featureId');
        for(let i = 0; i < item.featureId.length; i++){
            if(item.featureId[i]._id.toString() === feature._id.toString()){
                item.featureId.pull({_id: feature._id});
                await item.save();
            }
        }
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        await feature.remove();
        req.flash('alertMessage', 'Success delete Data Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
},
AddActivity: async(req, res) =>{
    const {name, type, itemId} = req.body;
    try{        
        if(!req.file){
            req.flash('alertMessage', 'Image not found');
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail-item/${itemId}`);
        }
        // console.log(req.file);
        const activity = await Activity.create({
            name,
            type,
            itemId,
            imageUrl: `images/${req.file.filename}`
        });
        
        const item = await Item.findOne({_id: itemId});
        item.activityId.push({_id: activity._id});
        await item.save();
        req.flash('alertMessage', 'Success Add Data Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }

}, 
EditActivity: async(req, res) =>{
    const {id, name, type, itemId} = req.body;
    try {
    const activity = await Activity.findOne({_id: id});
    if(req.file == undefined){
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash('alertMessage', 'Success Update Data Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }else{
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`
        await activity.save();
        req.flash('alertMessage', 'Success Update Data Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
    
},
DeleteActivity: async(req, res) =>{
    const {id, itemId} = req.params;
    try {
        const activity = await Activity.findOne({_id: id});
        const item = await (await Item.findOne({_id: itemId})).populate('activityId');
        for(let i = 0; i < item.activityId.length; i++){
            if(item.activityId[i]._id.toString() === activity._id.toString()){
                item.activityId.pull({_id: activity._id});
                await item.save();
            }
        }
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        await activity.remove();
        req.flash('alertMessage', 'Success delete Data Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
},
viewBooking: async (req, res) =>{
        try {
            const booking = await Booking.find()
            .populate('memberId')
            .populate('bankId');


            res.render('admin/booking/view_booking', {
                title: 'Staycation | Booking',
                user: req.session.user,
                booking
            });

            
        } catch (error) {
            res.redirect('/admin/booking');
        }
    },
showDetailBooking: async (req, res) =>{
    const {id} = req.params;
    try {
        const booking = await Booking.findOne({_id: id})
        .populate('memberId')
        .populate('bankId');
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert =  {message: alertMessage, status: alertStatus};
        res.render('admin/booking/show-detail-booking', {
            title: 'Staycation | Detail Booking',
            user: req.session.user,
            alert,
            booking
        });
    } catch (error) {
        res.redirect('/admin/booking');
    }
},
actionConfirmation: async (req, res) =>{
    const {id} = req.params;
    try {
        const booking = await Booking.findOne({_id: id});
        booking.payments.status = 'Approved';
        await booking.save();
        req.flash('alertMessage', 'Success confirmation pembayaran');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/booking/${id}`);
    } catch (error) {
        res.redirect(`/admin/booking/${id}`);
    }
},
actionReject: async (req, res) =>{
    const {id} = req.params;
    try {
        const booking = await Booking.findOne({_id: id});
        booking.payments.status = 'Rejected';
        await booking.save();
        req.flash('alertMessage', 'Success rejected pembayaran');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/booking/${id}`);
    } catch (error) {
        res.redirect(`/admin/booking/${id}`);
    }
}
}