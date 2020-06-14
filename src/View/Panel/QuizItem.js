import React, {PureComponent} from "react"
import Material from "../Components/Material"
import AddQuestion from "./AddQuestion"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import ImageShow from "../Components/ImageShow"
import {REST_URL} from "../../Functions/api"

class QuizItem extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            addQuestion: false,
        }
    }

    toggleAddModal = () => this.setState({...this.state, addQuestion: !this.state.addQuestion, update: undefined})

    toggleUpdate(update)
    {
        this.setState({...this.state, addQuestion: true, update})
    }

    render()
    {
        const {addQuestion, update} = this.state
        const {quiz, questions, addQuestionFunc, updateQuestionFunc, removeQuestion} = this.props
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">سوالات آزمون {quiz?.title}</div>
                {
                    questions && Object.values(questions).length > 0 &&
                    <div className="panel-0ff-code-scroll dont-gesture">
                        <div className="panel-0ff-code-cont title scroll-wider">
                            <div className="panel-0ff-code-item-big">سوال</div>
                            <div className="panel-0ff-code-item">گزینه 1</div>
                            <div className="panel-0ff-code-item">گزینه 2</div>
                            <div className="panel-0ff-code-item">گزینه 3</div>
                            <div className="panel-0ff-code-item">گزینه 4</div>
                            <div className="panel-0ff-code-item">صحیح</div>
                            <div className="panel-0ff-code-item">عکس</div>
                            <div className="panel-0ff-code-remove-cont">حذف</div>
                        </div>
                        {
                            Object.values(questions).map((post) =>
                                <div key={post._id} className="panel-0ff-code-cont scroll-wider" onClick={() => this.toggleUpdate(post)}>
                                    <div className="panel-0ff-code-item-big">{post.title}</div>
                                    <div className="panel-0ff-code-item">{post.first_answer}</div>
                                    <div className="panel-0ff-code-item">{post.second_answer}</div>
                                    <div className="panel-0ff-code-item">{post.third_answer}</div>
                                    <div className="panel-0ff-code-item">{post.forth_answer}</div>
                                    <div className="panel-0ff-code-item">{post.correct_answer}</div>
                                    <div className="panel-0ff-code-item">{post.picture && <ImageShow className="panel-0ff-code-item-img" src={REST_URL + post.picture} alt=""/>}</div>
                                    <CancelSvg className="panel-0ff-code-remove-cont" onClick={e => removeQuestion(post._id, e)}/>
                                </div>,
                            )
                        }
                    </div>
                }

                <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                    +
                </Material>

                {
                    addQuestion &&
                    <AddQuestion quiz_id={quiz?._id} update={update} addQuestionFunc={addQuestionFunc} updateQuestionFunc={updateQuestionFunc} toggleAddModal={this.toggleAddModal}/>
                }
            </section>
        )
    }
}

export default QuizItem