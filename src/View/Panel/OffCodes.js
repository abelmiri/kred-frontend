import React, {PureComponent} from "react"
import addCommaPrice from "../../Helpers/addCommaPrice"
import api from "../../Functions/api"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import {ClipLoader} from "react-spinners"

class OffCodes extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            offCodes: {},
            addOffCode: false,
            addLoading: false,
            amount_type: "fix",
            showUsers: false,
            users: [],
        }
    }

    componentDidMount()
    {
        api.get("off-code", `?time=${new Date().toISOString()}`)
            .then(results => this.setState({...this.state, offCodes: results.reduce((sum, code) => ({...sum, [code._id]: {...code}}), {})}))
            .catch((err) =>
            {
                console.log(err)
                this.setState({...this.state, error: true})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        window.onpopstate = () =>
        {
            if (document.body.clientWidth <= 480)
            {
                if (this.state.addOffCode)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, addOffCode: false})
                }
                if (this.state.showUsers)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, showUsers: false, users: []})
                }
            }
        }
    }

    toggleAddModal = () =>
    {
        const addOffCode = !this.state.addOffCode
        if (addOffCode)
        {
            if (document.body.clientWidth <= 480) window.history.pushState("", "", "/panel/off-codes/add")
            document.body.style.overflow = "hidden"
        }
        else
        {
            if (document.body.clientWidth <= 480) window.history.back()
            document.body.style.overflow = "auto"
        }
        this.setState({...this.state, addOffCode})
    }

    selectOffType(amount_type)
    {
        this.setState({...this.state, amount_type})
    }

    toggleUsersModal(id)
    {
        const showUsers = !this.state.showUsers
        if (showUsers)
        {
            if (document.body.clientWidth <= 480) window.history.pushState("", "", "/panel/off-codes/users")
            document.body.style.overflow = "hidden"
            api.get(`off-code/users/${id}`, `?time=${new Date().toISOString()}`)
                .then(users => this.setState({...this.state, users}))
                .catch((err) =>
                {
                    console.log(err)
                    this.setState({...this.state, error: true})
                })
            this.setState({...this.state, showUsers})
        }
        else
        {
            if (document.body.clientWidth <= 480) window.history.back()
            document.body.style.overflow = "auto"
            this.setState({...this.state, showUsers, users: []})
        }
    }

    createCode = () =>
    {
        if (!this.state.addLoading)
        {
            const {code, amount, max_usage, expire_date} = this
            const {amount_type} = this.state
            if (code.value && amount.value && max_usage.value && expire_date.value)
            {
                if (amount_type === "percent" && amount.value > 90) NotificationManager.warning("درصد تخفیف بالاتر از حد مجاز است!")
                else
                {
                    this.setState({...this.state, addLoading: true}, () =>
                    {
                        api.post("off-code", {
                            code: code.value,
                            max_usage: max_usage.value,
                            amount: amount.value,
                            amount_type,
                            expire_date: expire_date.value,
                        })
                            .then((code) =>
                            {
                                this.setState({...this.state, addLoading: false, offCodes: {[code._id]: {...code}, ...this.state.offCodes}}, () =>
                                {
                                    NotificationManager.success("کد تخفیف با موفقیت ساخته شد!")
                                    this.toggleAddModal()
                                })
                            })
                            .catch((err) => this.setState({...this.state, addLoading: false}, () => NotificationManager.error(err.response.data.errmsg)))
                    })
                }
            }
            else
            {
                if (!code.value) NotificationManager.warning("کد را وارد کنید!")
                if (!amount.value) NotificationManager.warning("مقدار را وارد کنید!")
                if (!max_usage.value) NotificationManager.warning("محدودیت را وارد کنید!")
                if (!expire_date.value) NotificationManager.warning("انقضا را وارد کنید!")
            }
        }
    }

    render()
    {
        const {offCodes, error, addOffCode, amount_type, addLoading, showUsers, users} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">کدهای تخفیف {Object.values(offCodes).length > 0 && `(${Object.values(offCodes).length})`}</div>
                <div className="panel-0ff-code-scroll dont-gesture">
                    <div className="panel-0ff-code-cont scroll title">
                        <div className="panel-0ff-code-item">کد</div>
                        <div className="panel-0ff-code-item">مدل</div>
                        <div className="panel-0ff-code-item">مقدار</div>
                        <div className="panel-0ff-code-item">مصرف</div>
                        <div className="panel-0ff-code-item">محدودیت</div>
                        <div className="panel-0ff-code-item">انقضا</div>
                    </div>
                    {
                        Object.values(offCodes).length > 0 ?
                            Object.values(offCodes).map(code =>
                                <div key={code._id} className="panel-0ff-code-cont scroll">
                                    <div className="panel-0ff-code-item">{code.code}</div>
                                    <div className="panel-0ff-code-item">{code.amount_type === "fix" ? "ثابت" : "درصدی"}</div>
                                    <div className="panel-0ff-code-item">{code.amount_type === "fix" ? <span>{addCommaPrice(code.amount)} ت</span> : <span>{code.amount} درصد</span>}</div>
                                    <div className="panel-0ff-code-item">{code.usage === 0 ? code.usage : <Material className="panel-0ff-code-usage" onClick={() => this.toggleUsersModal(code._id)}>{code.usage}</Material>}</div>
                                    <div className="panel-0ff-code-item">{code.max_usage}</div>
                                    <div className="panel-0ff-code-item">{new Date(code.expire_date).toLocaleDateString("fa-ir")}</div>
                                </div>,
                            )
                            :
                            <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                    }
                </div>
                <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                    +
                </Material>

                {
                    addOffCode &&
                    <React.Fragment>
                        <div className="create-exchange-cont create-small">
                            <div className='create-exchange-title'>ثبت کد تخفیف جدید</div>
                            <div className="panel-add-off-main">
                                <div className="panel-add-off-input-cont">
                                    <div className="panel-add-off-input-title">متن کد</div>
                                    <input className="panel-add-off-input" maxLength="20" ref={e => this.code = e}/>
                                </div>
                                <div className="panel-add-off-input-cont">
                                    <div className="panel-add-off-input-title">مدل</div>
                                    <label className='exchange-page-checkbox'>
                                        <input type="radio" name="price" defaultChecked onChange={e => e.target.checked ? this.selectOffType("fix") : null}/>
                                        <span className='check-mark'/>
                                        ثابت
                                    </label>
                                    <label className='exchange-page-checkbox'>
                                        <input type="radio" name="price" onChange={e => e.target.checked ? this.selectOffType("percent") : null}/>
                                        <span className='check-mark'/>
                                        درصدی
                                    </label>
                                </div>
                                <div className="panel-add-off-input-cont">
                                    <div className="panel-add-off-input-title">مقدار</div>
                                    <input className="panel-add-off-input" type="number" ref={e => this.amount = e}/>
                                    <div className="panel-add-off-hint">{amount_type === "fix" ? "تومان" : "درصد"}</div>
                                </div>
                                <div className="panel-add-off-input-cont">
                                    <div className="panel-add-off-input-title">محدودیت</div>
                                    <input className="panel-add-off-input" type="number" ref={e => this.max_usage = e}/>
                                </div>
                                <div className="panel-add-off-input-cont">
                                    <div className="panel-add-off-input-title">انقضا</div>
                                    <input className="panel-add-off-input" type="number" ref={e => this.expire_date = e}/>
                                    <div className="panel-add-off-hint">روز</div>
                                </div>
                                <Material className="panel-add-off-submit" onClick={this.createCode}>
                                    {addLoading ? <ClipLoader size={15} color="white"/> : "ثبت"}
                                </Material>
                            </div>
                        </div>
                        <div className="create-exchange-back" onClick={this.toggleAddModal}/>
                    </React.Fragment>
                }

                {
                    showUsers &&
                    <React.Fragment>
                        <div className="create-exchange-cont create-small">
                            <div className='create-exchange-title'>مصرف کنندگان کد</div>
                            <div className="panel-add-off-main">
                                <div className="panel-0ff-code-scroll dont-gesture">
                                    <div className="panel-0ff-code-cont title">
                                        <div className="panel-0ff-code-item">نام</div>
                                        <div className="panel-0ff-code-item">شماره</div>
                                        <div className="panel-0ff-code-item">ثبت نام</div>
                                    </div>
                                    {
                                        Object.values(users).length > 0 ?
                                            Object.values(users).map((user) =>
                                                <div key={user._id} className="panel-0ff-code-cont">
                                                    <div className="panel-0ff-code-item">{user.name || user.phone}</div>
                                                    <div className="panel-0ff-code-item">{user.phone}</div>
                                                    <div className="panel-0ff-code-item">{new Date(user.created_date).toLocaleDateString("fa-ir")}</div>
                                                </div>,
                                            )
                                            :
                                            <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="create-exchange-back" onClick={() => this.toggleUsersModal()}/>
                    </React.Fragment>
                }

            </section>
        )
    }
}

export default OffCodes