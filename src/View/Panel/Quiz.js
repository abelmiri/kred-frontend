import React, {PureComponent} from "react"
import Material from "../Components/Material"
import AddQuiz from "./AddQuiz"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import {NotificationManager} from "react-notifications"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import {Link, Switch, Route} from "react-router-dom"
import QuizItem from "./QuizItem"
import CopySvg from "../../Media/Svgs/CopySvg"
import copyToClipboard from "../../Helpers/copyToClipboard"

class Quiz extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            addQuiz: false,
            quizes: {},
            questions: {},
            getLoading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("quiz")
            .then(data =>
            {
                const {quizes, questions} = data
                this.setState({...this.state, getLoading: false, questions: questions.reduce((sum, item) => ({[item._id]: item, ...sum}), {}), quizes: quizes.reduce((sum, item) => ({[item._id]: item, ...sum}), {})})
            })
    }

    addQuiz = quiz => this.setState({...this.state, quizes: {[quiz._id]: {...quiz}, ...this.state.quizes}})

    addQuestionFunc = question => this.setState({...this.state, questions: {[question._id]: {...question}, ...this.state.questions}})
    updateQuestionFunc = question => this.setState({...this.state, questions: {...this.state.questions, [question._id]: {...question}}})

    toggleAddModal = () => this.setState({...this.state, addQuiz: !this.state.addQuiz})

    removeQuiz = (id, e) =>
    {
        e.preventDefault()
        e.stopPropagation()
        let result = window.confirm("مطمئنی ادمین؟!")
        if (result)
        {
            api.del("quiz", null, id)
                .then(() =>
                {
                    const quizes = {...this.state.quizes}
                    delete quizes[id]
                    this.setState({...this.state, quizes}, () => NotificationManager.success("با موفقیت حذف شد!"))
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد. اینترنت خود را بررسی کنید."))
        }
    }

    removeQuestion = (id, e) =>
    {
        e.stopPropagation()
        let result = window.confirm("مطمئنی ادمین؟!")
        if (result)
        {
            api.del("quiz/question", null, id)
                .then(() =>
                {
                    const questions = {...this.state.questions}
                    delete questions[id]
                    this.setState({...this.state, questions}, () => NotificationManager.success("با موفقیت حذف شد!"))
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد. اینترنت خود را بررسی کنید."))
        }
    }

    shareLink = (e, title, url) =>
    {
        e.preventDefault()

        if (navigator.share)
        {
            navigator.share({
                title,
                text: "کوئیز زیر رو ببین! \n",
                url,
            })
                .then(() => console.log("Successful share"))
                .catch(error => console.log("Error sharing:", error))
        }
        else copyToClipboard(url, () => NotificationManager.success("لینک با موفقیت کپی شد"))
    }

    render()
    {
        const {addQuiz, getLoading, quizes, questions} = this.state
        return (
            <section className="panel-page-section">
                <Switch>
                    <Route path="/panel/quiz/:id" render={route => <QuizItem removeQuestion={this.removeQuestion} addQuestionFunc={this.addQuestionFunc} updateQuestionFunc={this.updateQuestionFunc} quiz={quizes[route.match.params.id]} questions={Object.values(questions).filter(item => item.quiz_id === route.match.params.id)}/>}/>

                    <React.Fragment>
                        <div className="panel-page-section-title">آزمون‌ها{Object.values(quizes).length > 0 && ` (${Object.values(quizes).length})`}</div>

                        {
                            Object.values(quizes).length > 0 &&
                            <div className="panel-0ff-code-scroll dont-gesture">
                                <div className="panel-0ff-code-cont title scroll-wide">
                                    <div className="panel-0ff-code-item-big">عنوان</div>
                                    <div className="panel-0ff-code-item">محدودیت</div>
                                    <div className="panel-0ff-code-item">تعداد سوالات مصرفی</div>
                                    <div className="panel-0ff-code-item">لینک</div>
                                    <div className="panel-0ff-code-remove-cont">حذف</div>
                                </div>
                                {
                                    Object.values(quizes).map((post) =>
                                        <Link to={`/panel/quiz/${post._id}`} key={post._id} className="panel-0ff-code-cont scroll-wide">
                                            <div className="panel-0ff-code-item-big">{post.title}</div>
                                            <div className="panel-0ff-code-item">{post.minutes} دقیقه</div>
                                            <div className="panel-0ff-code-item">{post.count || "همه سوالات"}</div>
                                            <div className="panel-0ff-code-item">
                                                <Material className="post-like-count-cont copy" onClick={e => this.shareLink(e, post.title, `https://www.kred.ir/quiz/${post._id}`)}>
                                                    <CopySvg className="post-comment-svg"/>
                                                </Material>
                                            </div>
                                            <CancelSvg className="panel-0ff-code-remove-cont" onClick={(e) => this.removeQuiz(post._id, e)}/>
                                        </Link>,
                                    )
                                }
                            </div>
                        }
                        <div className={`exchange-page-loading ${getLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>

                        <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                            +
                        </Material>

                        {
                            addQuiz &&
                            <AddQuiz toggleAddModal={this.toggleAddModal} addQuiz={this.addQuiz}/>
                        }
                    </React.Fragment>
                </Switch>
            </section>
        )
    }
}

export default Quiz