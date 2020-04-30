import React, {PureComponent} from "react"
import Booklet from "../../Media/Svgs/Booklet"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import PdfGroupSvg from "../../Media/Svgs/PdfGroupSvg"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import {ClassResourcesItems} from "./ClassResourcesItems"
import QuestionsNew from "../../Media/Svgs/QuestionsNew"
import Questions from "../../Media/Svgs/Questions"
import AudioSvg from "../../Media/Svgs/AudioSvg"
import VoiceSvg from "../../Media/Svgs/VoiceSvg"

class ProfileSaves extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            handout: [],
            summary: [],
            question: [],
            voice: [],
            error: false,
            loading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("education-resource/save")
            .then(educations => this.setState({
                ...this.state,
                loading: false,
                handout: educations.filter(item => item.type === "handout"),
                summary: educations.filter(item => item.type === "summary"),
                question: educations.filter(item => item.type === "question"),
                voice: educations.filter(item => item.type === "voice"),
            }))
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    render()
    {
        const {handout, summary, question, voice, error, loading} = this.state
        return (
            <div className="profile-save-section">
                {
                    error ?
                        <div className="profile-save-section-err">برنامه در گرفتن اطلاعات با خطا مواجه شد!</div>
                        :
                        <React.Fragment>
                            <div className="profile-save-part">
                                <div>جزوه‌های من</div>
                                <Booklet className="profile-save-part-svg"/>
                            </div>
                            <div>
                                {
                                    loading ?
                                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                        :
                                        handout.length > 0 ?
                                            <div className="profile-save-part-cont">
                                                {
                                                    handout.map(item =>
                                                        <ClassResourcesItems key={item._id}
                                                                             item={item}
                                                                             svg={item.is_many ? <PdfGroupSvg className="class-handout-item-svg"/> : <PdfSvg className="class-handout-item-svg"/>}
                                                                             link={item.link}
                                                                             isSaveView={true}
                                                        />,
                                                    )
                                                }
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                            </div>
                                            :
                                            <div className="profile-save-part-empty">موردی یافت نشد!</div>
                                }
                            </div>
                            <div className="profile-save-part">
                                <div>نمونه سوالات من</div>
                                <QuestionsNew className="profile-save-part-svg"/>
                            </div>
                            <div>
                                {
                                    loading ?
                                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                        :
                                        question.length > 0 ?
                                            <div className="profile-save-part-cont">
                                                {
                                                    question.map(item =>
                                                        <ClassResourcesItems key={item._id}
                                                                             item={item}
                                                                             svg={item.is_many ? <PdfGroupSvg className="class-handout-item-svg"/> : <PdfSvg className="class-handout-item-svg"/>}
                                                                             type="question"
                                                                             link={item.link}
                                                                             isSaveView={true}
                                                        />,
                                                    )
                                                }
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                            </div>
                                            :
                                            <div className="profile-save-part-empty">موردی یافت نشد!</div>
                                }
                            </div>
                            <div className="profile-save-part">
                                <div>خلاصه درسهای من</div>
                                <Questions className="profile-save-part-svg"/>
                            </div>
                            <div>
                                {
                                    loading ?
                                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                        :
                                        summary.length > 0 ?
                                            <div className="profile-save-part-cont">
                                                {
                                                    summary.map(item =>
                                                        <ClassResourcesItems key={item._id}
                                                                             item={item}
                                                                             svg={item.is_many ? <PdfGroupSvg className="class-handout-item-svg"/> : <PdfSvg className="class-handout-item-svg"/>}
                                                                             link={item.link}
                                                                             isSaveView={true}
                                                        />,
                                                    )
                                                }
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                            </div>
                                            :
                                            <div className="profile-save-part-empty">موردی یافت نشد!</div>
                                }
                            </div>
                            <div className="profile-save-part">
                                <div>ویس‌های آموزشی من</div>
                                <AudioSvg className="profile-save-part-svg"/>
                            </div>
                            <div>
                                {
                                    loading ?
                                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                        :
                                        voice.length > 0 ?
                                            <div className="profile-save-part-cont">
                                                {
                                                    voice.map(item =>
                                                        <ClassResourcesItems key={item._id}
                                                                             item={item}
                                                                             svg={<VoiceSvg className="class-handout-item-svg"/>}
                                                                             link={item.link}
                                                                             isSaveView={true}
                                                        />,
                                                    )
                                                }
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                                <div className="class-handout-item-hide"/>
                                            </div>
                                            :
                                            <div className="profile-save-part-empty">موردی یافت نشد!</div>
                                }
                            </div>
                        </React.Fragment>
                }
            </div>
        )
    }
}

export default ProfileSaves