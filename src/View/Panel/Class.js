import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import PencilSvg from "../../Media/Svgs/Pencil"
import CameraSvg from "../../Media/Svgs/Camera"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import UploadFileSvg from "../../Media/Svgs/UploadFileSvg"
import TickSvg from "../../Media/Svgs/TickSvg"

class Class extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: false,
            loadingPercent: 0,
            selectedImagePreview: null,
            add: false,
            postsLoading: true,
            posts: {},
            isUpdating: false,
            selectedFile: null,
            blocks: {},
            lessons: {},
            lessonCategories: [],
            blockCategories: [],
        }
        this.title = ""
        this.university = ""
        this.writer = ""
        this.subject = ""
        this.teacher = ""
        this.pages_count = ""
        this.type = ""
        this.lesson_category_id = ""
        this.lesson_id = ""
        this.block_category_id = ""
        this.block_id = ""
        this.selectedImage = false
        this.selectedFile = false

        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("education-resource", `?limit=50&page=1`)
            .then((data) => this.setState({...this.state, postsLoading: false, posts: data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}))
            .catch(() => this.setState({...this.state, error: true, postsLoading: false}))

        api.get("lesson").then((data) => this.setState({...this.state, loading: false, lessons: data.reduce((sum, lesson) => ({...sum, [lesson._id]: {...lesson}}), {})}))
        api.get("lesson/category").then((data) => this.setState({...this.state, loading: false, lessonCategories: data}))
        api.get("block").then((data) => this.setState({...this.state, loading: false, blocks: data.reduce((sum, block) => ({...sum, [block._id]: {...block}}), {})}))
        api.get("block/category").then((data) => this.setState({...this.state, loading: false, blockCategories: data}))

        document.addEventListener("scroll", this.onScroll)
        window.addEventListener("popstate", this.onPopState)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
        window.removeEventListener("popstate", this.onPopState)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {posts} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(posts).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, postsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("education-resource", `?limit=50&page=${this.page}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, postsLoading: false, posts: {...posts, ...data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}})
                    })
                })
            }
        }, 20)
    }

    onPopState = () =>
    {
        if (document.body.clientWidth <= 480)
        {
            if (this.state.add)
            {
                document.body.style.overflow = "auto"
                this.setState({...this.state, add: false})
            }
        }
    }

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.selectedImage = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    selectFile = (e) =>
    {
        const file = e.target.files[0]
        e.target.value = ""
        this.selectedFile = file
        this.setState({...this.state, selectedFile: true})
    }

    changeType = e => this.type = e.target.value

    setTitle = value => this.title = value

    setUniversity = value => this.university = value

    setPagesCount = value => this.pages_count = value

    setTeacher = value => this.teacher = value

    setWriter = value => this.writer = value

    setSubject = value => this.subject = value

    changeLessonCategory = e => this.lesson_category_id = e.target.value

    changeLesson = e => this.lesson_id = e.target.value

    changeBlockCategory = e => this.block_category_id = e.target.value

    changeBlock = e => this.block_id = e.target.value

    submit = () =>
    {
        const {isUpdating, loading} = this.state

        const title = this.title.trim()
        const university = this.university.trim()
        const teacher = this.teacher.trim()
        const pages_count = this.pages_count.trim()
        const writer = this.writer.trim()
        const subject = this.subject.trim()
        const type = this.type
        const lesson_category_id = this.lesson_category_id
        const lesson_id = this.lesson_id
        const block_category_id = this.block_category_id
        const block_id = this.block_id

        if (!loading)
        {
            if (!isUpdating)
            {
                if (title.length > 0 && type.length > 0 && this.selectedFile && (lesson_category_id || lesson_id || block_category_id || block_id))
                {
                    this.setState({...this.state, loading: true}, () =>
                    {
                        let form = new FormData()
                        form.append("title", title)
                        form.append("type", type)
                        form.append("file", this.selectedFile)
                        if (university) form.append("university", university)
                        if (teacher) form.append("teacher", teacher)
                        if (writer) form.append("writer", writer)
                        if (pages_count) form.append("pages_count", pages_count)
                        if (subject) form.append("subject", subject)
                        if (lesson_category_id) form.append("lesson_category_id", lesson_category_id)
                        if (lesson_id) form.append("lesson_id", lesson_id)
                        if (block_category_id) form.append("block_category_id", block_category_id)
                        if (block_id) form.append("block_id", block_id)
                        if (this.selectedImage)
                        {
                            compressImage(this.selectedImage)
                                .then(picture =>
                                {
                                    form.append("picture", picture)
                                    this.postData(form)
                                })
                        }
                        else this.postData(form)
                    })
                }
                else
                {
                    if (title.length === 0) NotificationManager.warning("فیلد عنوان را پر کنید!")
                    if (type.length === 0) NotificationManager.warning("نوع را انتخاب کنید!")
                    if (!this.selectedFile) NotificationManager.warning("فایل را انتخاب کنید!")
                    if (!(lesson_category_id || lesson_id || block_category_id || block_id)) NotificationManager.warning("حداقل یکی از فیلدهای دسته بندی درس، درس، دسته بندی بلوک یا بلوک را انتخاب کنید!")
                }
            }
            else
            {
                if (
                    title.length > 0 || university.length > 0 || teacher.length > 0 || writer.length > 0 || subject.length > 0 || pages_count.length > 0 ||
                    type.length > 0 || this.selectedFile || this.selectedImage || lesson_category_id || lesson_id || block_category_id || block_id
                )
                {
                    let form = new FormData()
                    form.append("education_id", isUpdating._id)
                    if (title) form.append("title", title)
                    if (type) form.append("type", type)
                    if (this.selectedFile) form.append("file", this.selectedFile)
                    if (university) form.append("university", university)
                    if (teacher) form.append("teacher", teacher)
                    if (writer) form.append("writer", writer)
                    if (pages_count) form.append("pages_count", pages_count)
                    if (subject) form.append("subject", subject)
                    if (lesson_category_id) form.append("lesson_category_id", lesson_category_id)
                    if (lesson_id) form.append("lesson_id", lesson_id)
                    if (block_category_id) form.append("block_category_id", block_category_id)
                    if (block_id) form.append("block_id", block_id)
                    if (this.selectedImage)
                    {
                        compressImage(this.selectedImage)
                            .then(picture =>
                            {
                                form.append("picture", picture)
                                this.patchData(form)
                            })
                    }
                    else this.patchData(form)
                }
                else NotificationManager.warning("شما تغییری ایجاد نکرده اید!")
            }
        }
    }

    postData(form)
    {
        api.post("education-resource", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then((education) =>
                this.setState({...this.state, posts: {[education._id]: {...education}, ...this.state.posts}, loading: false}, () =>
                {
                    NotificationManager.success("با موفقیت ثبت شد ادمین جون.")
                    this.toggleAddModal()
                }),
            )
            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
    }

    patchData(form)
    {
        api.patch("education-resource", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then((updateEducation) =>
                this.setState({...this.state, posts: {...this.state.posts, [updateEducation._id]: {...updateEducation}}, loading: false}, () =>
                {
                    NotificationManager.success("با موفقیت آپدیت شد ادمین جون.")
                    this.toggleAddModal()
                }),
            )
            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
    }

    toggleAddModal = () =>
    {
        if (!this.state.loading)
        {
            const add = !this.state.add
            if (add)
            {
                if (document.body.clientWidth <= 480) window.history.pushState("", "", "/panel/class/add")
                document.body.style.overflow = "hidden"
                this.setState({...this.state, add})
            }
            else
            {
                if (document.body.clientWidth <= 480) window.history.back()
                document.body.style.overflow = "auto"
                this.setState({...this.state, add, isUpdating: false, loading: false, loadingPercent: 0, selectedFile: null, selectedImagePreview: null}, () =>
                {
                    this.title = ""
                    this.university = ""
                    this.writer = ""
                    this.subject = ""
                    this.teacher = ""
                    this.type = ""
                    this.pages_count = ""
                    this.lesson_category_id = ""
                    this.lesson_id = ""
                    this.block_category_id = ""
                    this.block_id = ""
                    this.selectedImage = false
                    this.selectedFile = false
                })
            }
        }
    }

    goForUpdate(post)
    {
        this.setState({...this.state, isUpdating: {...post}}, () => this.toggleAddModal())
    }

    render()
    {
        const {add, posts, postsLoading, selectedImagePreview, loading, loadingPercent, isUpdating, selectedFile, blocks, lessons, lessonCategories, blockCategories} = this.state
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">کلاس درس</div>

                {
                    Object.values(posts).length > 0 &&
                    <React.Fragment>
                        <div className="panel-0ff-code-cont title">
                            <div className="panel-0ff-code-item-big">عنوان</div>
                            <div className="panel-0ff-code-item">نوع</div>
                        </div>
                        {
                            Object.values(posts).map((post) =>
                                <Material key={post._id} className="panel-0ff-code-cont" onClick={() => this.goForUpdate(post)}>
                                    <div className="panel-0ff-code-item-big">{post.title}</div>
                                    <div className="panel-0ff-code-item">{post.type === "handout" ? "جزوه" : post.type === "voice" ? "ویس‌آموزشی" : post.type === "summary" ? "خلاصه درس" : "نمونه سوال"}</div>
                                </Material>,
                            )
                        }
                    </React.Fragment>
                }
                <div className={`exchange-page-loading ${postsLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>

                <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                    +
                </Material>

                {
                    add &&
                    <React.Fragment>
                        <div className="create-exchange-cont bigger-size create-small">
                            <div className="create-exchange-title">{isUpdating ? "ویرایش" : "ساخت"} منبع آموزشی</div>
                            <div className="panel-add-off-main">
                                <MaterialInput disabled={loading} defaultValue={isUpdating.title} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="عنوان *" getValue={this.setTitle}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.university} className="panel-add-pav-title" backgroundColor="white" label="دانشگاه" getValue={this.setUniversity}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.pages_count} className="panel-add-pav-title" backgroundColor="white" label="تعداد صفحات" getValue={this.setPagesCount}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.teacher} className="panel-add-pav-title" backgroundColor="white" label="استاد" getValue={this.setTeacher}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.subject} className="panel-add-pav-title" backgroundColor="white" label="موضوع" getValue={this.setSubject}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.writer} className="panel-add-pav-title" backgroundColor="white" label="نویسنده" getValue={this.setWriter}/>
                                <select disabled={loading} defaultValue={isUpdating.type} className="panel-class-type" onChange={this.changeType}>
                                    <option value="">انتخاب نوع</option>
                                    <option value="handout">جزوه</option>
                                    <option value="voice">ویس‌آموزشی</option>
                                    <option value="question">نمونه سوال</option>
                                    <option value="summary">خلاصه درس</option>
                                </select>
                                <select disabled={loading} defaultValue={isUpdating.lesson_category_id} className="panel-class-type" onChange={this.changeLessonCategory}>
                                    <option value="">انتخاب دسته بندی درسی</option>
                                    {
                                        lessonCategories.map(item =>
                                            <option key={item._id} value={item._id}>{lessons[item.lesson_id].title} -> {item.title}</option>,
                                        )
                                    }
                                </select>
                                <select disabled={loading} defaultValue={isUpdating.lesson_id} className="panel-class-type" onChange={this.changeLesson}>
                                    <option value="">انتخاب درس</option>
                                    {
                                        Object.values(lessons).map(item =>
                                            lessonCategories.filter(cat => cat.lesson_id === item._id).length === 0 && <option key={item._id} value={item._id}>{item.title}</option>,
                                        )
                                    }
                                </select>
                                <select disabled={loading} defaultValue={isUpdating.block_category_id} className="panel-class-type" onChange={this.changeBlockCategory}>
                                    <option value="">انتخاب دسته بندی بلوکی</option>
                                    {
                                        blockCategories.map(item =>
                                            <option key={item._id} value={item._id}>{blocks[item.block_id].title} -> {item.title}</option>,
                                        )
                                    }
                                </select>
                                <select disabled={loading} defaultValue={isUpdating.block_id} className="panel-class-type" onChange={this.changeBlock}>
                                    <option value="">انتخاب بلوک</option>
                                    {
                                        Object.values(blocks).map(item =>
                                            blockCategories.filter(cat => cat.block_id === item._id).length === 0 && <option key={item._id} value={item._id}>{item.title}</option>,
                                        )
                                    }
                                </select>
                                <label className="panel-add-audio">
                                    {
                                        selectedFile || isUpdating.file ?
                                            <React.Fragment>
                                                <TickSvg className="panel-add-audio-svg success"/>
                                            </React.Fragment>
                                            :
                                            <UploadFileSvg className="panel-add-audio-svg"/>
                                    }
                                    <input disabled={loading} type="file" hidden accept=".pdf,.mp3" onChange={this.selectFile}/>
                                </label>
                                <label className="panel-add-img">
                                    {
                                        selectedImagePreview || isUpdating.picture ?
                                            <React.Fragment>
                                                <img src={selectedImagePreview || REST_URL + "/" + isUpdating.picture} className="create-exchange-selected-img" alt=""/>
                                                {!loading && <PencilSvg className="create-exchange-edit-svg"/>}
                                            </React.Fragment>
                                            :
                                            <CameraSvg className="create-exchange-svg"/>
                                    }
                                    {loading && <div className="create-exchange-edit-svg">{loadingPercent} %</div>}
                                    <div className="create-exchange-selected-uploading" style={{transform: `scaleY(${loadingPercent / 100})`}}/>
                                    <input disabled={loading} type="file" hidden accept="image/*" onChange={this.selectImage}/>
                                </label>
                                <Material className="panel-add-pav-submit" onClick={this.submit}>ثبت</Material>
                            </div>
                        </div>
                        <div className="create-exchange-back" onClick={this.toggleAddModal}/>
                    </React.Fragment>
                }

            </section>
        )
    }
}

export default Class