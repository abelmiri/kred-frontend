import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import GoQuiz from "../Components/GoQuiz"

class ShowQuiz extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    shuffle(array, count)
    {
        let currentIndex = array.length, temporaryValue, randomIndex

        // While there remain elements to shuffle...
        while (0 !== currentIndex)
        {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            // And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        if (count) return array.slice(0, count)
        else return array
    }

    componentDidMount()
    {
        const {quizId} = this.props
        api.get("quiz", quizId)
            .then(quiz =>
            {
                let questions = [...quiz.questions]
                let shuffle = this.shuffle(questions, quiz.count)
                this.setState({...this.state, quiz: {...quiz, questions: [...shuffle]}})
            })
            .catch(err =>
            {
                if (err?.response?.status === 404) this.setState({...this.state, notFound: true})
                else this.setState({...this.state, error: true})
            })
    }

    render()
    {
        const {quiz, error, notFound} = this.state
        return (
            <div className="quiz-show-cont">
                {
                    notFound ?
                        <div className="profile-save-part-empty">موردی یافت نشد!</div>
                        :
                        error ?
                            <div className="profile-save-part-empty">مشکل در برقراری ارتباط!</div>
                            :
                            quiz ?
                                <GoQuiz quiz={quiz}/>
                                :
                                <div className="exchange-page-loading not-found"><ClipLoader size={24} color="#3AAFA9"/></div>
                }
            </div>
        )
    }
}

export default ShowQuiz