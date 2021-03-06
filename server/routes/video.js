const express = require('express');
const router = express.Router();
const { Video } = require("../models/video");
const multer = require("multer"); // 업로드 하는데 필요한 모듈
const { auth } = require("../middleware/auth");
const {Subscriber} = require("../models/Subscriber")
var ffmpeg = require('fluent-ffmpeg')

let storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename : (req,file,cb) =>{
        cb(null , `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 allowed'),false)
        }
        cb(null,true);
    }

})

const upload = multer({storage: storage}).single("file")

//=================================
//             video
//=================================
router.post('/uploadfiles' , (req,res)=>{
    // 비디오를 서버에 저장 
    upload(req,res,err=>{
        if(err){
            console.log(err)
            return res.json({success:false , err})
        }
        return res.json({success:true, url:res.req.file.path, filename:res.req.file.fieldname})
    })
});

router.post('/uploadVideo' , (req,res)=>{
  const video =  new Video(req.body);
  video.save((err,doc)=> {
      if(err) return res.json({success:false, err})
      res.status(200).json({success:true})
  })
});
 
router.get('/getVideos' , (req,res)=>{
    //비디오를 가져와서 클라에 보내자
    Video.find()
    .populate('writer')
    .exec((err,videos)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true,videos})
    })
  });
   

  router.post('/getVideoDetail' , (req,res)=>{
    //console.log(req.body);
    Video.findOne({"_id" : req.body.videoId})
        .populate('writer')
        .exec((err,videoDetail)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json( {success:true, videoDetail } )
        })
  });

router.post('/thumbnail' , (req,res)=>{
   // 썸네일 생성하고 비디오 러닝 타임도 가져오기 

   let filePath = ''
   let fileDuration = ''
    // 비디오 정보가져오기
    
    ffmpeg.ffprobe(req.body.url, function(err,metadata){
        //console.dir(metadata)
        //console.log(metadata.format)
        fileDuration = metadata.format.duration
    })
   //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames',function(filenames){
       // console.log('Will generate' + filenames.join(', '))
      //  console.log(filenames);
        filePath = 'uploads/thumbnails/' + filenames[0]
    })
    .on('end' , function(){
        console.log("스크린샷 OK");
        return res.json({success:true, url : filePath , fileDuration : fileDuration})
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success:false, err})

    })
    .screenshot({
        count : 3,
        folder : 'uploads/thumbnails',
        size: '320x240',
        filename:'thumbnail-%b.png'
         
    })
   
});


router.post('/getSubscriptVideos' , (req,res)=>{
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다. 
    Subscriber.find({ 'userFrom' : req.body.userFrom})
        .exec((err,subscriberInfo)=>{
            if(err) return res.status(400).send(err)
          
            let subscribedUser = [];
            subscriberInfo.map((subscriber,i)=>{
                subscribedUser.push(subscriber.userTo)
            })


            // 찾은 사람들의 비디오를 가지고 온다. 

            Video.find({writer : { $in : subscribedUser}})
                .populate('writer')
                .exec((err,videos)=>{
                  
                    if(err) return res.status(400).send(err);
                    res.status(200).json({success:true, videos})
                    
                })
 
 
         })
  
 
 });
 


module.exports = router;