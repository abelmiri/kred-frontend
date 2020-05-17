import React, {PureComponent} from "react"
import Material from "../Components/Material"
import AddQuestion from "./AddQuestion"
import CancelSvg from "../../Media/Svgs/CancelSvg"

class QuizItem extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            addQuestion: false,
        }
    }

    toggleAddModal = () => this.setState({...this.state, addQuestion: !this.state.addQuestion})

    render()
    {
        const {addQuestion} = this.state
        const {quiz, questions, addQuestionFunc, removeQuestion} = this.props
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">سوالات آزمون {quiz?.title}</div>
                {
                    questions && Object.values(questions).length > 0 &&
                    <React.Fragment>
                        <div className="panel-0ff-code-cont title">
                            <div className="panel-0ff-code-item-big">سوال</div>
                            <div className="panel-0ff-code-item">گزینه 1</div>
                            <div className="panel-0ff-code-item">گزینه 2</div>
                            <div className="panel-0ff-code-item">گزینه 3</div>
                            <div className="panel-0ff-code-item">گزینه 4</div>
                            <div className="panel-0ff-code-item">صحیح</div>
                            <div className="panel-0ff-code-remove-cont">حذف</div>
                        </div>
                        {
                            Object.values(questions).map((post) =>
                                <div key={post._id} className="panel-0ff-code-cont">
                                    <div className="panel-0ff-code-item-big">{post.title}</div>
                                    <div className="panel-0ff-code-item">{post.first_answer}</div>
                                    <div className="panel-0ff-code-item">{post.second_answer}</div>
                                    <div className="panel-0ff-code-item">{post.third_answer}</div>
                                    <div className="panel-0ff-code-item">{post.forth_answer}</div>
                                    <div className="panel-0ff-code-item">{post.correct_answer}</div>
                                    <CancelSvg className="panel-0ff-code-remove-cont" onClick={() => removeQuestion(post._id)}/>
                                </div>,
                            )
                        }
                    </React.Fragment>
                }

                <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                    +
                </Material>

                {
                    addQuestion &&
                    <AddQuestion quiz_id={quiz?._id} addQuestionFunc={addQuestionFunc} toggleAddModal={this.toggleAddModal}/>
                }
            </section>
        )
    }
}

export default QuizItem