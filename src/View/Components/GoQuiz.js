import React, {PureComponent} from "react"
import Material from "./Material"
import ImageShow from "./ImageShow"
import {REST_URL} from "../../Functions/api"

class GoQuiz extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            started: false,
            ended: false,
            endedTime: false,
            questionIndex: 0,
            trues: 0,
            falses: 0,
        }
    }

    start = () =>
    {
        this.setState({...this.state, started: true}, () =>
        {
            const {quiz} = this.props
            this.timer = setTimeout(() =>
            {
                this.setState({...this.state, ended: true, endedTime: true})
            }, quiz.minutes * 60 * 1000)
        })
    }

    next = () =>
    {
        let {trues, falses, answer, questionIndex} = this.state
        const {quiz} = this.props
        if (answer)
        {
            if (parseInt(answer) === parseInt(quiz.questions[questionIndex].correct_answer)) trues++
            else falses++
        }
        this.setState({
            ...this.state,
            ended: questionIndex >= quiz.questions.length - 1,
            trues,
            falses,
            questionIndex: questionIndex < quiz.questions.length - 1 ? questionIndex + 1 : questionIndex,
            answer: undefined,
        }, () => questionIndex >= quiz.questions.length - 1 && clearTimeout(this.timer))
    }

    setAnswer(answer)
    {
        this.setState({...this.state, answer})
    }

    render()
    {
        const {quiz} = this.props
        const {questionIndex, started, answer, ended, trues, falses, endedTime} = this.state
        return (
            <div>
                {
                    ended ?
                        <div>
                            <div className="quiz-title">آزمون {quiz.title}</div>
                            <div className="quiz-title-field">تعداد سوالات: {quiz.questions.length}</div>
                            <div className="quiz-title-field">تعداد صحیح ها: {trues}</div>
                            <div className="quiz-title-field">تعداد غلط ها: {falses}</div>
                            <div className="quiz-title-field">تعداد نزده ها: {quiz.questions.length - trues - falses}</div>
                            <div className="quiz-end">
                                {endedTime ? "تایم شما تمام شد" : "پایان"}
                            </div>
                        </div>
                        :
                        !started ?
                            <div>
                                <div className="quiz-title">آزمون {quiz.title}</div>
                                <div className="quiz-title-field">تعداد سوالات: {quiz.questions.length}</div>
                                <div className="quiz-title-field">تایم: {quiz.minutes} دقیقه</div>
                                <Material className="quiz-go" onClick={this.start}>شرکت در آزمون</Material>
                            </div>
                            :
                            <div>
                                <div className="quiz-text">{quiz.questions[questionIndex].title}</div>
                                {quiz.questions[questionIndex].picture && <ImageShow className="quiz-img" src={REST_URL + quiz.questions[questionIndex].picture}/>}
                                <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setAnswer("1")}>
                                    <div className={`seyed-radio ${answer === "1" ? "selected" : ""} `}/>
                                    <div className="seyed-radio-label">{quiz.questions[questionIndex].first_answer}</div>
                                </Material>
                                <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setAnswer("2")}>
                                    <div className={`seyed-radio ${answer === "2" ? "selected" : ""} `}/>
                                    <div className="seyed-radio-label">{quiz.questions[questionIndex].second_answer}</div>
                                </Material>
                                <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setAnswer("3")}>
                                    <div className={`seyed-radio ${answer === "3" ? "selected" : ""} `}/>
                                    <div className="seyed-radio-label">{quiz.questions[questionIndex].third_answer}</div>
                                </Material>
                                <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setAnswer("4")}>
                                    <div className={`seyed-radio ${answer === "4" ? "selected" : ""} `}/>
                                    <div className="seyed-radio-label">{quiz.questions[questionIndex].forth_answer}</div>
                                </Material>
                                {
                                    questionIndex < quiz.questions.length - 1 ?
                                        <Material className="quiz-go" onClick={this.next}>سوال بعدی</Material>
                                        :
                                        <Material className="quiz-go" onClick={this.next}>پایان</Material>
                                }
                            </div>
                }
            </div>
        )
    }
}

export default GoQuiz