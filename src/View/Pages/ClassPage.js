import React, {PureComponent} from "react"

class ClassPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
        }
    }

    render()
    {
        return (
            <React.Fragment>
                <div className='page-background-img class'>
                    <div className='page-des-cont'>
                        <h2 className='exchange-desc class'>گپ و گفت</h2>
                        <h3 className='exchange-text class'>
                            اینجا میتونی هرچی برای درس خوندن لازم داری؛ از خلاصه درس و
                            <br/>
                            نمونه سوال گرفته تا کلاس آموزشی پیدا کنی
                        </h3>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ClassPage