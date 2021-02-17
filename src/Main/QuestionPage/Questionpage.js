import React from "react";
import ReactDom from "react-dom";
import Uppericons from "../MainLayout/uppericons";
import Lowericons from "../MainLayout/lowericons";
import MobileUpper from "../MainLayout/MobileView/UpperMobile";
import LowerMobile from "../MainLayout/MobileView/LowerMobile";
import User from "../MainLayout/user";
import $ from "jquery";
import Modal from "./modal";
import Statusmodel from "./Statusmodel";
import ReactMarkdown from "react-markdown";
import { useHistory } from "react-router-dom";

function Questionpage(props) {
  const [question, setQuestion] = React.useState("");
  const history = useHistory();
  const [answer, setAnswer] = React.useState("");
  const [abuse, setAbuse] = React.useState(false);
  const [text, setText] = React.useState("");
  const [thanks, setThanks] = React.useState(false);
  const [hint, setHint] = React.useState("Loading...");
    
    var quesno;
    $.ajax({
        url:
          "https://mananxunbao.herokuapp.com/api/question/?fid=" +
          localStorage.getItem("facebookid"),
        type: "GET",
        crossDomain: true,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).done(data => {
        var obj = JSON.parse(JSON.stringify(data));
        quesno = obj[0].no;
        console.log(quesno);
        if(quesno>0){
         history.push("./winner");
         }
      });
      
      
  React.useEffect(() => {
    
      $.ajax({
        url:
          "https://mananxunbao.herokuapp.com/api/question/?fid=" +
          localStorage.getItem("facebookid"),
        type: "GET",
        crossDomain: true,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).done(data => {
        var obj = JSON.parse(JSON.stringify(data));
        setQuestion(obj[0].ques);
        
      });
   
  }, [question]);
  const handleHint = () => {
    $.ajax({
      url: "https://mananxunbao.herokuapp.com/api/hint/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      cache: false,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      data: JSON.stringify({
        fid: localStorage.getItem("facebookid")
      }),
      complete: function(data) {
        if (data.responseJSON) setHint(data.responseJSON.hint);
      }
    });
  };
  const handleSubmit = () => {
    setText("Loading.....");
    setAbuse(false);
    $.ajax({
      url: "https://mananxunbao.herokuapp.com/api/submission/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      cache: false,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      data: JSON.stringify({
        fid: localStorage.getItem("facebookid"),
        answer: answer
      }),
      complete: function(data) {
        var statusis = data.responseJSON;
        //------------Right Answer------------------

        if (statusis && statusis.response === "Correct") {
          setAbuse(false);
          setText("Well Done! Correct");
          setQuestion("loading");
          setAnswer("");
        } else {
          //------------Wrong Answer Abuses------------------

          var abusesarr = [
            "Are you always this stupid, or are you making a special effort today?",
            "Somewhere out there is a tree working hard to replace the oxygen you wasted, now go apologize to it.",
            "Stupidity is not a crime, if it is, you’ll end up in jail.",
            "Error 404 brain not found aaya Tumse na ho paayega",
            "You are a sad strange little man, and you have my pity.",
            "After all this time, is that what you came up with? ",
            "You must have been born on a highway because that's where most accidents happen.",
            "Am I a joke to you?",
            "Yeh kya bawasir bana diye ",
            "Only two things are infinite-- the universe and your stupidity, and I'm not so sure about the former.","Don’t take yourself so seriously, no one else does.","Stupid!!!!! I’m sorry I hurt your feelings when I called you stupid. I really thought you already knew.","I don’t hate you but I’m just not necessarily excited about your existence.","Zombies eat brains, don’t worry, you’re safe.","After reading this, well I have to go now because I'm due back on the planet earth.","Keep rolling your eyes, maybe you’ll find a brain back there.","Light travels faster than sound. This is why some people appear bright until they guess the answer.","If I wanted to kill myself I would climb your ego and jump to your IQ.","You must have been born on a highway because that’s where most accidents happen.","If common sense is common why are you without it?"
          ];

          var num = Math.floor(Math.random() * 19);
          setAbuse(true);
          setText(abusesarr[num]);
        }
      }
    });
  };
  return (
    <div className="main-layout" className="mobilecolumn">
      <br />
      <div>
        <MobileUpper />
      </div>

      <div class="row row-space">
        <div class="col-md-2">
          <Uppericons />
        </div>
        <div class="col-md-8" className="QuestionPageContainer">
          <div>
            <div className="questionpageimg">
              <User />
            </div>
            <h1 className="QuestionHeading"> Questions </h1>
            <hr className="Questionhr" />
            <br />

            <div id="questiontext">
              <ReactMarkdown
                className="QuestionText"
                id="Question"
                source={question}
                escapeHtml={false}
              />
              {!thanks ? (
                <>
                  <div className="col95">
                    <input
                      type="text"
                      id="AnswerField"
                      name="Answerield"
                      placeholder="Your Answer"
                      onChange={e => setAnswer(e.target.value)}
                      value={answer}
                    />
                  </div>
                  <div className="col555">
                    <Modal hint={hint} handleHint={handleHint} />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            <Statusmodel handlSubmit={handleSubmit} abuse={abuse} text={text} />
          </div>
        </div>
        <div class="col-md-2">
          <Lowericons />
        </div>
        <div class="col-md-2">
          <LowerMobile />
        </div>
      </div>
    </div>
  );
}
export default Questionpage;
