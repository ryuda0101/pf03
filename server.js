// npm init
// npm install ejs express mongodb 
// npm install express-session passport passport-local
// npm install multer moment moment-timezone

// 설치한것을 불러들여 그 안의 함수 명령어들을 쓰기위해 변수로 세팅
const express = require("express");
// 데이터베이스의 데이터 입력, 출력을 위한 함수명령어 불러들이는 작업
const MongoClient = require("mongodb").MongoClient;
// 시간 관련된 데이터 받아오기위한 moment라이브러리 사용(함수)
const moment = require("moment");
// 로그인 관련 데이터 받아오기위한 작업
// 로그인 검증을 위해 passport 라이브러리 불러들임
const passport = require('passport');
// Strategy(전략) → 로그인 검증을 하기 위한 방법을 쓰기 위해 함수를 불러들이는 작업
const LocalStrategy = require('passport-local').Strategy;
// 사용자의 로그인 데이터 관리를 위한 세션 생성에 관련된 함수 명령어 사용
const session = require('express-session');
// 게시글, 댓글 작성시 시간 한국시간으로 설정해서 넣는 함수 명령어 
const momentTimezone = require("moment-timezone");
// 파일업로드 라이브러리 multer
const multer  = require('multer')

const app = express();

// 포트번호 변수로 세팅
const port = process.env.PORT || 8080;
// const port = 8080;


// ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
// 사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
// css나 img, js와 같은 정적인 파일 사용하려면 ↓ 하단의 코드를 작성해야한다.
app.use(express.static('public'));


// 로그인 관련 작언을 하기 위한 세팅
// 로그인 관련 작업시 세션을 생성하고 데이터를 기록할 때 세션 이름의 접두사 / 세션 변경시 자동저장 유무 설정
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
// passport라이브러리 실행
app.use(passport.initialize());
// 로그인 검증시 세션데이터를 이용해서 검증하겠다.
app.use(passport.session());


// Mongodb 데이터 베이스 연결작업
// 데이터베이스 연결을 위한 변수 세팅 (변수의 이름은 자유롭게 지어도 ok)
let db;
// Mongodb에서 데이터베이스를 만들고 데이터베이스 클릭 → connect → Connect your application → 주소 복사, password에는 데이터베이스 만들때 썼었던 비밀번호를 입력해 준다.
MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.g2xxxrk.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    // 에러가 발생했을 경우 메세지 출력 (선택사항임. 안쓴다고 해서 문제가 되지는 않는다.)
    if(err){ return console.log(err);}

    // 위에서 만든 db변수에 최종적으로 연결 / ()안에는 mongodb atlas에서 생성한 데이터 베이스 이름 집어넣기
    db = result.db("portfolio03");

    // db연결이 제대로 되었다면 서버 실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});

// 첨부파일 기능
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
      }
})
const upload = multer({ storage: storage })

// 로그인 작업 시작
// 관리자 로그인 페이지
app.get("/admin_login",(req,res) => {
    res.render("admin/admin_login");
});

app.post("/adminLogin",passport.authenticate('local', {failureRedirect : '/fail'}),(req,res) => {
    res.redirect("/admin")
});

// 로그인 실패시 fail 경로
app.get("/fail",(req,res) => {
    db.collection('user_admin').find({}).toArray((err, result) => {
    });
    res.send("<script>alert('아이디를 다시한번 확인해 주세요.'); location.href = '/admin_login'</script>");
});

passport.use(new LocalStrategy({
    usernameField: 'admin_id',    // login.ejs에서 입력한 아이디의 name값
    passwordField: 'admin_pass',    // login.ejs에서 입력한 비밀번호의 name값
    session: true,      // 세션을 이용할것인지에 대한 여부
    passReqToCallback: false,   // 아이디와 비밀번호 말고도 다른 항목들을 더 검사할것인가에 대한 여부
  }, function (admin_id, admin_pass, done) {
    db.collection('user_admin').findOne({ id: admin_id }, function (err, result) {
      if (err) return done(err)
// 아래의 message는 필요에 따라 뻴수도 있다. 
      if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다.' })
      if (admin_pass == result.pass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호를 다시한번 확인해주세요.' })
      }
    })
}));

// 최초의 로그인시 한번 실행
// serializeUser    →   처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
// ↓ 여기서 생성된 매게변수 user로 req.user~~를 쓸 수 있다.
passport.serializeUser(function (user, done) {
     // ↓ 서버에는 세션을 만들고 / 사용자 웹 브라우저에는 쿠키를 만들어준다. 
    done(null, user.id)
});

// 로그인 할 때마다 실행
// deserializeUser  →   로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 담겨있는 회원정보 데이터를 보내주는 처리
passport.deserializeUser(function (admin_id, done) {
    db.collection("user_admin").findOne({id:admin_id},function(err,result){
        done(null,result)
    });
});

// 로그아웃 기능 작업
app.get("/logout",function(req,res){
    // 서버의 세션을 삭제하고, 본인 웹브라우저의 쿠키를 삭제한다.
    req.session.destroy(function(err,result){
        // 지워줄 쿠키를 선택한다. / 콘솔 로그의 application → cookies에 가면 name에서 확인할 수 있다.
        res.clearCookie("connect.sid")
        // 로그아웃 후 다시 메인페이지로 돌아가기
        res.redirect("/admin_login");
    });
});





// 메인 페이지
app.get("/",(req,res) => {
    db.collection("brd_event").find({}).sort({num:-1}).toArray((err,event_result) => {
        db.collection("brd").find({}).toArray((err,brd_result) => {
            db.collection("brd_review").find({}).toArray((err,review_result) => {
                db.collection("brd_qna").find({}).toArray((err,qna_result) => {
                    res.render("index",{eventData:event_result, brd:brd_result, qnaData:qna_result, reviewData:review_result});
                });
            });
        });
    });
});

// 메인페이지 상담 예약
app.post("/reservation",(req,res) => {
    db.collection("count").findOne({name:"상담 예약"},(err,count_result) => {
        db.collection("brd_reservation").insertOne({
            num:count_result.count + 1,
            name:req.body.name,
            birth:req.body.birth,
            phone:req.body.phone,
            symptom:req.body.symptom,
            date:moment().tz("Asia/Seoul").format("YYYY-MM-DD h:mm a"),
        },(err,result) => {
            db.collection("count").updateOne({name:"상담 예약"},{$inc:{count:1}},(err,result) => {
                res.redirect("/");
            });
        });
    });
});

// 관리자 메인 페이지
app.get("/admin", (req,res) => {
    res.render("admin/admin_main",{userData:req.user})
});

// 상담 예약 목록 페이지
app.get("/admin_reservation",async (req,res) => {
    // 현재 접속한 페이지의 페이징 번호
    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
    // 한 페이지당 보여줄 데이터 갯수
    let perPage = 5;
    // 한 블록당 보여줄 페이징 갯수
    let blockCount = 2;
    // 현재 접속한 페이지의 블록
    let blockNum = Math.ceil(pageNumber / blockCount);
    // 블록 안에 있는 페이징의 시작번호
    let blockStart = ((blockNum - 1) * blockCount) + 1;
    // 블록 안에 있는 페이징의 끝번호
    let blockEnd = blockStart + blockCount - 1;
    // db의 collection에있는 전체 객체의 갯수값
    let totalData = await db.collection("brd").countDocuments({});
    // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
    let paging = Math.ceil(totalData / perPage);
    // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
    if (blockEnd > paging) {
        blockEnd = paging; 
    }
    // 블록의 총 개수
    let totalBlock = Math.ceil(paging / blockCount);
    // db에서 꺼내오는 데이터의 시작 순번값
    let startDbData = (pageNumber - 1) * perPage;
    
    // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
    // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd_reservation").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((err,result) => {
        res.render("admin/admin_reservation_list",{
            userData:req.user,
            reservationData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 관리자 상담 예약 상세 페이지
app.get("/admin_reservation_detail/:no", (req,res) => {
    db.collection("brd_reservation").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_reservation_detail", {userData:req.user, reservationData:result})
    });
});

// 관리자 상담 삭제 페이지
app.get("/admin_reservation_delete/:no",(req,res) => {
    db.collection("brd_reservation").deleteOne({num:Number(req.params.no)},(err,result) => {
        res.redirect("/admin_reservation");
    });
})

// 관리자 보도자료 게시판 페이지
app.get("/admin_board",async (req,res) => {
    // 현재 접속한 페이지의 페이징 번호
    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
    // 한 페이지당 보여줄 데이터 갯수
    let perPage = 5;
    // 한 블록당 보여줄 페이징 갯수
    let blockCount = 2;
    // 현재 접속한 페이지의 블록
    let blockNum = Math.ceil(pageNumber / blockCount);
    // 블록 안에 있는 페이징의 시작번호
    let blockStart = ((blockNum - 1) * blockCount) + 1;
    // 블록 안에 있는 페이징의 끝번호
    let blockEnd = blockStart + blockCount - 1;
    // db의 collection에있는 전체 객체의 갯수값
    let totalData = await db.collection("brd").countDocuments({});
    // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
    let paging = Math.ceil(totalData / perPage);
    // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
    if (blockEnd > paging) {
        blockEnd = paging; 
    }
    // 블록의 총 개수
    let totalBlock = Math.ceil(paging / blockCount);
    // db에서 꺼내오는 데이터의 시작 순번값
    let startDbData = (pageNumber - 1) * perPage;
    
    // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
    // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((err,result) => {
        res.render("admin/admin_board_list",{
            userData:req.user,
            brdData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 관리자 보도자료 상세 페이지
app.get("/admin_board_detail/:no",(req,res) => {
    db.collection("brd").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_board_detail",{userData:req.user, brdData:result});
    });
});

// 관리자 보도자료 추가 페이지
app.get("/admin_board_add",(req,res) => {
    res.render("admin/admin_board_add",{userData:req.user});
});

app.post("/board_add",upload.single('brd_file'),(req,res) => {
    if (req.file) {
        fileUpload = req.file.originalname;
    }
    else {
        fileUpload = null;
    }
    db.collection("count").findOne({name:"보도자료 게시글"},(err,count_result) => {
        db.collection("brd").insertOne({
            num:count_result.count + 1,
            title:req.body.brd_title,
            doc:req.body.brd_doc,
            file:fileUpload,
            context:req.body.brd_context,
            date:moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
            auther:req.body.brd_auther
        },(err,result) => {
            db.collection("count").updateOne ({name:"보도자료 게시글"},{$inc:{count:1}},(err,result) => {
                res.redirect("/admin_board");
            });
        });
    });
});

// 관리자 보도자료 삭제 페이지
app.get("/brd_delete/:no",(req,res) => {
    db.collection("brd").deleteOne({num:Number(req.params.no)},(err,result) => {
        res.redirect("/admin_board")
    });
});

// 관리자 보도자료 수정 페이지
app.get("/brd_edit/:no",(req,res) => {
    db.collection("brd").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_board_edit",{userData:req.user, brdData:result});
    });
});

app.post("/board_edit",upload.single('brd_file'),(req,res) => {
    if (req.file) {
        fileUpload = req.file.originalname;
    }
    else {
        fileUpload = req.body.brd_hidden_file;
    }
    db.collection("brd").updateOne({num:Number(req.body.brd_number)},{$set:{
        title:req.body.brd_title,
        doc:req.body.brd_doc,
        file:fileUpload,
        context:req.body.brd_context
    }},(err,result) => {
        res.redirect("/admin_board_detail/" + Number(req.body.brd_number))
    });
});



// 관리자 이벤트 게시판 페이지
app.get("/admin_event",async (req,res) => {
        // 현재 접속한 페이지의 페이징 번호
        let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
        // 한 페이지당 보여줄 데이터 갯수
        let perPage = 5;
        // 한 블록당 보여줄 페이징 갯수
        let blockCount = 2;
        // 현재 접속한 페이지의 블록
        let blockNum = Math.ceil(pageNumber / blockCount);
        // 블록 안에 있는 페이징의 시작번호
        let blockStart = ((blockNum - 1) * blockCount) + 1;
        // 블록 안에 있는 페이징의 끝번호
        let blockEnd = blockStart + blockCount - 1;
        // db의 collection에있는 전체 객체의 갯수값
        let totalData = await db.collection("brd_event").countDocuments({});
        // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
        let paging = Math.ceil(totalData / perPage);
        // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
        if (blockEnd > paging) {
            blockEnd = paging; 
        }
        // 블록의 총 개수
        let totalBlock = Math.ceil(paging / blockCount);
        // db에서 꺼내오는 데이터의 시작 순번값
        let startDbData = (pageNumber - 1) * perPage;
        
        // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
        // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd_event").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((err,result) => {
        res.render("admin/admin_event_list",{
            userData:req.user,
            eventData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 관리자 이벤트 상세 페이지
app.get("/admin_event_detail/:no",(req,res) => {
    db.collection("brd_event").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_event_detail",{userData:req.user, eventData:result});
    });
});

// 관리자 이벤트 추가 페이지
app.get("/admin_event_insert",(req,res) => {
    res.render("admin/admin_event_add",{userData:req.user});
});

// app.post("/event_add",upload.single('thumbnail_file'),(req,res) => {
app.post("/event_add",upload.fields([{name:'thumbnail_file'},{name:'event_file1'},{name:'event_file2'}]),(req,res) => {
    if (req.files.thumbnail_file) {
        thumbnailUpload = req.files.thumbnail_file[0].originalname; 
    }
    else {
        thumbnailUpload = null;
    }
    if (req.files.event_file1) {
        eventUpload1 = req.files.event_file1[0].originalname; 
    }
    else {
        eventUpload1 = null;
    }
    if (req.files.event_file2) {
        eventUpload2 = req.files.event_file2[0].originalname; 
    }
    else {
        eventUpload2 = null;
    }
    db.collection("count").findOne({name:"이벤트 게시글"},(err,count_result) => {
        db.collection("brd_event").insertOne({
            num:count_result.count + 1,
            title:req.body.event_title,
            date:req.body.event_date,
            thumbnail:thumbnailUpload,
            eventFile1:eventUpload1,
            eventFile2:eventUpload2,
            context:req.body.event_context,
            auther:req.body.event_auther
        },(err,result) => {
            db.collection("count").updateOne({name:"이벤트 게시글"},{$inc:{count:1}},(err,result) => {
                res.redirect("/admin_event");
            });
        });
    });
});

// 관리자 이벤트 삭제 페이지
app.get("/admin_event_delete/:no",(req,res) => {
    db.collection("brd_event").deleteOne({num:Number(req.params.no)},(err,result) => {
        res.redirect("/admin_event")
    });
});

// 관리자 이벤트 수정 페이지
app.get("/admin_event_edit/:no",(req,res) => {
    db.collection("brd_event").find({num:Number(req.params.no)}).toArray((err,result) => {
       res.render("admin/admin_event_edit", {userData:req.user, eventData:result})
    });
});

// 삼항연산자로 줄이기
app.post("/event_edit",upload.fields([{name:'thumbnail_file'},{name:'event_file1'},{name:'event_file2'}]),(req,res) => {
    if (req.files.thumbnail_file) {
        thumbnailUpload = req.files.thumbnail_file[0].originalname; 
    }
    else if (req.body.thumbnail_hidden_file) {
        thumbnailUpload = req.body.thumbnail_hidden_file;
    }
    else {
        thumbnailUpload = null
    }
    
    if (req.files.event_file1) {
        eventUpload1 = req.files.event_file1[0].originalname; 
    }
    else if (req.body.event_file1_hidden_file) {
        eventUpload1 = req.body.event_file1_hidden_file;
    }
    else {
        eventUpload1 = null
    }

    if (req.files.event_file2) {
        eventUpload2 = req.files.event_file2[0].originalname; 
    }
    else if (req.body.event_file2_hidden_file) {
        eventUpload2 = req.body.event_file2_hidden_file;
    }
    else {
        eventUpload2 = null
    }

    db.collection("brd_event").updateOne({num:Number(req.body.event_number)},{$set:{
        title:req.body.event_title,
        thumbnail:thumbnailUpload,
        eventFile1:eventUpload1,
        eventFile2:eventUpload2,
        context:req.body.event_context
    }},(err,result) => {
        res.redirect("/admin_event");
    });
});





// 관리자 온라인 상담 목록 페이지
app.get("/admin_qna",async (req,res) => {
        // 현재 접속한 페이지의 페이징 번호
        let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
        // 한 페이지당 보여줄 데이터 갯수
        let perPage = 5;
        // 한 블록당 보여줄 페이징 갯수
        let blockCount = 2;
        // 현재 접속한 페이지의 블록
        let blockNum = Math.ceil(pageNumber / blockCount);
        // 블록 안에 있는 페이징의 시작번호
        let blockStart = ((blockNum - 1) * blockCount) + 1;
        // 블록 안에 있는 페이징의 끝번호
        let blockEnd = blockStart + blockCount - 1;
        // db의 collection에있는 전체 객체의 갯수값
        let totalData = await db.collection("brd_qna").countDocuments({});
        // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
        let paging = Math.ceil(totalData / perPage);
        // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
        if (blockEnd > paging) {
            blockEnd = paging; 
        }
        // 블록의 총 개수
        let totalBlock = Math.ceil(paging / blockCount);
        // db에서 꺼내오는 데이터의 시작 순번값
        let startDbData = (pageNumber - 1) * perPage;
        
        // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
        // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd_qna").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((err,result) => {
        res.render("admin/admin_qna_list",{
            userData:req.user,
            qnaData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 관리자 온라인 상담 상세 페이지
app.get("/admin_qna_detail/:no",(req,res) => {
    db.collection("brd_qna").find({num:Number(req.params.no)}).toArray((err,result) => {
        db.collection("brd_qna_answer").find({qna_brd_num:Number(req.params.no)}).toArray((err,answer_result) => {
            res.render("admin/admin_qna_detail",{userData:req.user ,qnaData:result, answerData:answer_result});
        });
    });
});

// 관리자 온라인 상담 댓글 답변
app.post("/qna_answer",(req,res) => {
    db.collection("count").findOne({name:"온라인 상담 답변"},(err,count_result) => {
        db.collection("brd_qna_answer").insertOne({
            qna_brd_num:Number(req.body.qna_number),
            answer_num:count_result.count + 1,
            answer:req.body.answer
        },(err,result) => {
            db.collection("count").updateOne ({name:"온라인 상담 답변"}, {$inc:{count:1}},(err,result) => {
                res.redirect("/admin_qna_detail/" + Number(req.body.qna_number));
            })
        });
    });
});

// // 관리자 온라인 상담 답변 수정
app.post("/answer_edit",(req,res) => {
    db.collection("brd_qna_answer").findOne({qna_brd_num:Number(req.body.hidden_qna_brd_num)},(err,result1) => {
        db.collection("brd_qna_answer").updateOne({answer_num:Number(req.body.hidden_answer_num)},{$set:{
            answer:req.body.answer_edit_form
        }}, (err,result2) => {
            res.redirect("/admin_qna_detail/" + result1.qna_brd_num);
        });
    });
});

// 관리자 온라인 상담 답변 삭제
app.get("/answer_delete/:no", (req,res) => {
    db.collection("brd_qna_answer").findOne({answer_num:Number(req.params.no)},(err,result1) => {
        db.collection("brd_qna_answer").deleteOne({answer_num:Number(req.params.no)},(err,result2) => {
            res.redirect("/admin_qna_detail/" + result1.qna_brd_num);

        });
    });
});







// 관리자 온라인 상담 삭제 페이지
app.get("/qna_delete/:no",(req,res) => {
    db.collection("brd_qna").deleteOne({num:Number(req.params.no)},(err,result) => {
        res.redirect("/admin_qna");
    });
});

// 관리자 온라인 상담 수정 페이지
app.get("/qna_edit/:no",(req,res) => {
    db.collection("brd_qna").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_qna_edit",{userData:req.user ,qnaData:result});
    });
});

app.post("/qna_edit",upload.single('qna_file'),(req,res) => {
    if (req.file) {
        fileUpload = req.file.originalname;
    }
    else {
        fileUpload = req.body.qna_hidden_file;
    }
    db.collection("brd_qna").updateOne({num:Number(req.body.qna_number)},{$set:{
        name:req.body.customer_name,
        phone:req.body.customer_phone,
        title:req.body.qna_title,
        file:fileUpload,
        context:req.body.qna_context,
    }},(err,result) => {
        res.redirect("/admin_qna_detail/" + Number(req.body.qna_number))
    });
});





// 관리자 고객 후기 목록 페이지
app.get("/admin_review",async (req,res) => {
        // 현재 접속한 페이지의 페이징 번호
        let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
        // 한 페이지당 보여줄 데이터 갯수
        let perPage = 5;
        // 한 블록당 보여줄 페이징 갯수
        let blockCount = 2;
        // 현재 접속한 페이지의 블록
        let blockNum = Math.ceil(pageNumber / blockCount);
        // 블록 안에 있는 페이징의 시작번호
        let blockStart = ((blockNum - 1) * blockCount) + 1;
        // 블록 안에 있는 페이징의 끝번호
        let blockEnd = blockStart + blockCount - 1;
        // db의 collection에있는 전체 객체의 갯수값
        let totalData = await db.collection("brd_review").countDocuments({});
        // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
        let paging = Math.ceil(totalData / perPage);
        // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
        if (blockEnd > paging) {
            blockEnd = paging; 
        }
        // 블록의 총 개수
        let totalBlock = Math.ceil(paging / blockCount);
        // db에서 꺼내오는 데이터의 시작 순번값
        let startDbData = (pageNumber - 1) * perPage;
        
        // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
        // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd_review").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((er,result) => {
        res.render("admin/admin_review_list",{
            userData:req.user,
            reviewData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 관리자 고객 후기 상세 페이지
app.get("/admin_review_detail/:no",(req,res) => {
    db.collection("brd_review").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_review_detail",{userData:req.user, reviewData:result});
    });
});

// 관리자 고객 후기 수정 페이지
app.get("/review_edit/:no",(req,res) => {
    db.collection("brd_review").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("admin/admin_review_edit",{userData:req.user ,reviewData:result});
    });
});

app.post("/review_edit",upload.single('review_file'),(req,res) => {
    if (req.file) {
        fileUpload = req.file.originalname;
    }
    else {
        fileUpload = req.body.review_hidden_file;
    }
    db.collection("brd_review").updateOne({num:Number(req.body.review_number)},{$set:{
        name:req.body.review_name,
        title:req.body.review_title,
        file:fileUpload,
        context:req.body.review_context,
    }},(err,result) => {
        res.redirect("/admin_review_detail/" + Number(req.body.review_number))
    });
});

// 관리자 고객 후기 삭제 페이지
app.get("/review_delete/:no",(req,res) => {
    db.collection("brd_review").deleteOne({num:Number(req.params.no)},(err,result) => {
        res.redirect("/admin_review");
    });
});




// 보도자료 목록 페이지
app.get("/board",async (req,res) => {
    // 현재 접속한 페이지의 페이징 번호
    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
    // 한 페이지당 보여줄 데이터 갯수
    let perPage = 5;
    // 한 블록당 보여줄 페이징 갯수
    let blockCount = 2;
    // 현재 접속한 페이지의 블록
    let blockNum = Math.ceil(pageNumber / blockCount);
    // 블록 안에 있는 페이징의 시작번호
    let blockStart = ((blockNum - 1) * blockCount) + 1;
    // 블록 안에 있는 페이징의 끝번호
    let blockEnd = blockStart + blockCount - 1;
    // db의 collection에있는 전체 객체의 갯수값
    let totalData = await db.collection("brd").countDocuments({});
    // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
    let paging = Math.ceil(totalData / perPage);
    // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
    if (blockEnd > paging) {
        blockEnd = paging; 
    }
    // 블록의 총 개수
    let totalBlock = Math.ceil(paging / blockCount);
    // db에서 꺼내오는 데이터의 시작 순번값
    let startDbData = (pageNumber - 1) * perPage;
    
    // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
    // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((err,result) => {
        res.render("board_list",{
            brdData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 보도자료 상세 페이지
app.get("/board_detail/:no",(req,res) => {
    db.collection("brd").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("board_detail",{brdData:result});
    });
});

// 이벤트 목록 페이지
app.get("/event",(req,res) => {
    db.collection("brd_event").find({}).sort({num:-1}).toArray((err,result) => {
        res.render("event_list",{eventData:result});
    });
});

// 이벤트 상세 페이지
app.get("/event_detail/:no",(req,res) => {
    db.collection("brd_event").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("event_detail",{eventData:result});
    });
});


// 온라인 상담 목록 페이지
app.get("/qna",async (req,res) => {
        // 현재 접속한 페이지의 페이징 번호
        let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
        // 한 페이지당 보여줄 데이터 갯수
        let perPage = 5;
        // 한 블록당 보여줄 페이징 갯수
        let blockCount = 2;
        // 현재 접속한 페이지의 블록
        let blockNum = Math.ceil(pageNumber / blockCount);
        // 블록 안에 있는 페이징의 시작번호
        let blockStart = ((blockNum - 1) * blockCount) + 1;
        // 블록 안에 있는 페이징의 끝번호
        let blockEnd = blockStart + blockCount - 1;
        // db의 collection에있는 전체 객체의 갯수값
        let totalData = await db.collection("brd_qna").countDocuments({});
        // 전체 데이터값을 통해서 만들어져야하는 페이징 개수 계산
        let paging = Math.ceil(totalData / perPage);
        // 블록에서 마지막 번호가 페이징의 끝번호 보다 크다면, 페이징의 끝번호를 강제로 부여
        if (blockEnd > paging) {
            blockEnd = paging; 
        }
        // 블록의 총 개수
        let totalBlock = Math.ceil(paging / blockCount);
        // db에서 꺼내오는 데이터의 시작 순번값
        let startDbData = (pageNumber - 1) * perPage;
        
        // db의 실제 값을 꺼내올 때 한 페이지당 몇개씩 가져올건지  skip() limit()함수로 설정
        // sort()로 가져온 데이터 내림차순으로 정렬
    db.collection("brd_qna").find({}).sort({num:-1}).skip(startDbData).limit(perPage).toArray((err,result) => {
        res.render("qna_list",{
            qnaData:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        });
    });
});

// 온라인 상담 상세 페이지
app.get("/qna_detail/:no",(req,res) => {
    db.collection("brd_qna").find({num:Number(req.params.no)}).toArray((err,result) => {
        db.collection("brd_qna_answer").find({qna_brd_num:Number(req.params.no)}).toArray((err,answer_result) => {
            res.render("qna_detail",{qnaData:result, answerData:answer_result});
        });
    });
});


// 온라인 상담 작성 페이지
app.get("/qna_insert",(req,res) => {
    res.render("qna_add");
});

app.post("/qna_add",upload.single('qna_file'),(req,res) => {
    if (req.file) {
        fileUpload = req.file.originalname; 
    }
    else {
        fileUpload = null;
    }
    db.collection("count").findOne({name:"온라인 상담 게시글"},(err,count_result) => {
        db.collection("brd_qna").insertOne({
            num:count_result.count + 1,
            name:req.body.customer_name,
            phone:req.body.customer_phone,
            title:req.body.qna_title,
            file:fileUpload,
            context:req.body.qna_context,
            date:moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
        },(err,result) => {
            db.collection("count").updateOne ({name:"온라인 상담 게시글"},{$inc:{count:1}},(err,result) => {
                res.redirect("/qna");
            });
        });
    });
});








// 고객후기 목록 페이지
app.get("/review",(req,res) => {
    db.collection("brd_review").find({}).toArray((er,result) => {
        res.render("review_list",{reviewData:result});
    });
});

// 고객후기 상세 페이지
app.get("/review_detail/:no",(req,res) => {
    db.collection("brd_review").find({num:Number(req.params.no)}).toArray((err,result) => {
        res.render("review_detail",{reviewData:result});
    });
});

// 고객후기 작성 페이지
app.get("/review_insert",(req,res) => {
    res.render("review_add");
});

app.post("/review_add",upload.single('review_file'),(req,res) => {
    if (req.file) {
        fileUpload = req.file.originalname; 
    }
    else {
        fileUpload = null;
    }
    db.collection("count").findOne({name:"고객후기 게시글"},(err,count_result) => {
        db.collection("brd_review").insertOne({
            num:count_result.count + 1,
            name:req.body.review_name,
            title:req.body.review_title,
            file:fileUpload,
            context:req.body.review_context,
            date:moment().tz("Asia/Seoul").format("YYYY-MM-DD")
        },(err,result) => {
            db.collection("count").updateOne ({name:"고객후기 게시글"},{$inc:{count:1}},(err,result) => {
                res.redirect("/review");
            });
        });
    });
});
