import React, { Component, useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { isEmail } from "validator";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { withRouter } from "../common/with-router";

import AuthService from "../services/auth.service";

import "../css/login.css";
import 'react-toastify/dist/ReactToastify.css';

function Login2(props) {

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState();
    const [isDisplayPopUp, setIsDisplayPopUp] = useState(false);
    const [successfulRegister, setSuccessfulRegister] = useState(false);
    const [successfulLogin, setSuccessfulLogin] = useState(false);

    useEffect(() => {

    }, [successfulLogin, successfulRegister]);

    const form = useRef();
    // const form2 = useRef();
    const checkBtn = useRef();
    // const checkBtn2 = useRef();

    const required = (value) => {
        if (!value && isDisplayPopUp) {
            toast("This field is required!");
            return (
                <ToastContainer />
            );
        }
    };

    // validator functions
    const vusername = (value) => {
        if (!value) {
            return (<div className="alert-danger">Username cannot be empty</div>);
        }
        else if (value.length < 3 || value.length > 20) {
            return (<div className="alert-danger">Username must be between 3 and 20 characters.</div>);
        }
    };

    const vpassword = (value) => {
        if (!value) {
            return (<div className="alert-danger">Password cannot be empty</div>);
        }
        else if (value.length < 6 || value.length > 40) {
            return (<div className="alert-danger">Must be 6 to 40 characters.</div>);
        }
    };

    const vemail = (value) => {
        if (!value) {
            return (<div className="alert-danger">Email cannot be empty</div>);
        }
        else if (!isEmail(value)) {
            return (<div className="alert-danger">This it not a valid email!</div>);
        }
    };
    // end of validator functions

    const notifyLogin = (message) => {

        if (successfulLogin) {
            toast.success(message, {
                toastId: "loginSuccess"
            });
            return (
                <ToastContainer />
            );
        } else {
            toast.error(message, {
                toastId: "loginFailed"
            });
            return (
                <ToastContainer />
            );

        }

    }

    const notifyRegister = (message) => {

        if (successfulRegister) {
            toast.success(message, {
                toastId: "registerSuccess"
            });
            return (
                <ToastContainer />
            );
        } else {
            toast.error(message, {
                toastId: "registerFailed"
            });
            return (
                <ToastContainer />
            );

        }
    }

    //onchange functions
    function onChangeUsername(e) {
        setUsername(e.target.value);
    }

    function onChangeEmail(e) {
        setEmail(e.target.value);
    }

    function onChangePassword(e) {
        setPassword(e.target.value);
    }
    //end of onchange functions

    function allowDisplayPopUp() {
        //set state to true for 3 second
        if (isDisplayPopUp == false) {
            setIsDisplayPopUp(true);
            setTimeout(() => {
                setIsDisplayPopUp(false);
            }, 5000);
        }
    }

    function handleRegisterClick() {
        isLogin ? setIsLogin(false) : setIsLogin(true);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        allowDisplayPopUp();
        setSuccessfulLogin(false);
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.login(username, password).then(() => {
                setMessage("Login successfully");
                setSuccessfulLogin(true);
                // console.log("reached here");
                //delay for 2 seconds
                setTimeout(() => {
                    props.router.navigate("/profile");
                    window.location.reload();
                }, 2500);
            }, error => {
                const resMessage = error.response && error.response.data && error.response.data.message || error.message || error.toString();
                setSuccessfulLogin(false);
                setLoading(false);
                setMessage(resMessage);
            });
        } else {
            setLoading(false);
        }
    };

    const handleRegister = async(e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        allowDisplayPopUp(true);
        setSuccessfulRegister(false);
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.register(username, email, password, "USER").then(response => {
                setMessage(response.data.message);
                setSuccessfulRegister(true);
            }, error => {
                const resMessage = error.response && error.response.data && error.response.data.message || error.message || error.toString();
                setSuccessfulRegister(false);
                setLoading(false);
                setMessage(resMessage);
            });
        } else {
            setLoading(false);
        }
    };

    function loginAfterRegister() {
        setTimeout(() => {
            // console.log("successful: " + successful);
            if (successfulRegister) {
                AuthService.login(username, password).then(async () => {
                    /* not a good way of implementing here, reimplement smoother*/
                    props.router.navigate("/home"); //refresh

                    window.location.reload();
                }, error => {
                    const resMessage = error.response && error.response.data && error.response.data.message || error.message || error.toString();
                });
            }
        }, 2500);
    }

    return (
        <div data-bg="" class="green">
            <div data-bg="" class="green-close" onClick={props.onClick}></div>
            <div data-bg="" class="green-content">
                {/* <div data-qr="" data-bg="" class="green-scan">
                    <div data-qr="" class="green-scan-top">

                        left side content if any

                    </div>
                </div>
                <div data-bg="" class="green-line"></div> */}
                {isLogin ?
                    <div data-loginwrapper="" data-bg="" class="green-login-wrapper">

                        <Form onSubmit={handleLogin} ref={c => {
                            form.current = c;
                        }}>

                            <div data-loginwrapper="" class="green-tab">
                                <span data-loginwrapper="" class="green-tab-password isActive"> User Login </span>
                                {/* <span data-loginwrapper="" class="green-tab-line"></span>
                            <span data-loginwrapper="" class="green-tab-message"> SMS Login </span> */}
                            </div>
                            <div data-login="" data-loginwrapper="" class="green-password-wrapper" data-form-type="other">


                                {/* USERNAME BOX */}
                                <div data-login="" class="green-account">
                                    <span data-login="" class="text">Username</span>
                                    <Input data-login="" type="text" placeholder="username" data-form-type="other" value={username} onChange={onChangeUsername} validations={[vusername]} />
                                </div>
                                
                                {/* EMAIL BOX */}
                                <div data-login="" class="green-email" style={{display:"none"}}>
                                    <span data-login="" class="text">Email</span>
                                    <Input data-login="" type="text" placeholder="email" data-form-type="other" value="example@green-investor.com" onChange={onChangeEmail} validations={[vemail]} />
                                </div>

                                {/* PASSWORD BOX */}
                                <div data-login="" class="green-password">
                                    <div data-login="" class="left" style={{ display: "flex", height: "43px", alignItems: "center" }}>
                                        <span data-login="" class="text">Password</span>
                                        <Input data-login="" placeholder="password" type="password" data-kwimpalastatus="alive" data-kwimpalaid="1665774009604-0" data-form-type="password" value={password} onChange={onChangePassword} validations={[vpassword]} />
                                    </div>
                                    <div data-v-362304c0="" data-login="" class="eye-btn" style={{}}>
                                        <svg data-v-362304c0="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path data-v-362304c0="" fill-rule="evenodd" clip-rule="evenodd" d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z" fill="#9499A0"></path>
                                        </svg>
                                    </div>
                                    {/* <span data-login="" class="forget"> Forgot Pw </span> */}
                                    <div data-login="" class="forget-tip" style={{ display: "none" }}>
                                        <img data-login="" src="https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/arrow.fa71fe60.png" alt="" class="arrow" />
                                        <div data-login="" class="forget-tip-line">
                                            <p data-login="" class="title">发送短信快速登录</p>
                                            <p data-login="" class="desc">未注册或绑定哔哩哔哩的手机号，将帮你注册新账号</p>
                                        </div>
                                        <div data-login="" class="forget-tip-line">
                                            <p data-login="" class="title">去找回密码</p>
                                            <p data-login="" class="desc">通过绑定的手机号/邮箱重置密码</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div data-loginwrapper="" class="green-login-register-wrapper">
                                <div data-loginwrapper="" class="universal-btn register-btn" onClick={handleRegisterClick}> Register </div>
                                <button
                                    data-loginwrapper=""
                                    class="universal-btn login-btn"
                                    disabled={loading}
                                >
                                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                                    Login </button>

                                {message && isDisplayPopUp && <div className="form-group">
                                    {notifyLogin(message)}
                                </div>}

                                <CheckButton style={{
                                    display: "none"
                                }} ref={c => {
                                    checkBtn.current = c;
                                }} />
                            </div>

                        </Form>

                        <div data-thirdpartylogin="" data-loginwrapper="" class="third-party-login-wrapper" style={{height:"8vh"}}>
                            <div data-thirdpartylogin="" class="title"></div>
                            <div data-thirdpartylogin="" class="sns">
                                {/* <span data-thirdpartylogin="" class="btn google">Google</span>
                                <span data-thirdpartylogin="" class="btn facebook">Facebook</span> */}
                            </div>
                        </div>
                    </div>

                    :
                    // After register click
                    <div data-loginwrapper="" data-bg="" class="green-login-wrapper">

                        <Form onSubmit={handleRegister} ref={c => {
                            form.current = c;
                        }}>

                            <div data-loginwrapper="" class="green-tab">
                                <span data-loginwrapper="" class="green-tab-password isActive"> User Registration </span>
                                {/* <span data-loginwrapper="" class="green-tab-line"></span>
                            <span data-loginwrapper="" class="green-tab-message"> 短信登录 </span> */}
                            </div>
                            <div data-login="" data-loginwrapper="" class="green-password-wrapper" data-form-type="other">
                                {/* USERNAME BOX */}
                                <div data-login="" class="green-account">
                                    <span data-login="" class="text">Username</span>
                                    <Input data-login="" type="text" placeholder="username" data-form-type="other" value={username} onChange={onChangeUsername} validations={[vusername]} />
                                </div>

                                {/* EMAIL BOX */}
                                <div data-login="" class="green-email">
                                    <span data-login="" class="text">Email</span>
                                    <Input data-login="" type="text" placeholder="email" data-form-type="other" value={email} onChange={onChangeEmail} validations={[vemail]} />
                                </div>

                                {/* PASSWORD BOX */}
                                <div data-login="" class="green-password">
                                    <div data-login="" class="left" style={{ display: "flex", height: "43px", alignItems: "center" }}>
                                        <span data-login="" class="text">Password</span>
                                        <Input data-login="" placeholder="password" type="password" data-kwimpalastatus="alive" data-kwimpalaid="1665774009604-0" data-form-type="password" value={password} onChange={onChangePassword} validations={[vpassword]} />
                                    </div>
                                    <div data-v-362304c0="" data-login="" class="eye-btn" style={{}}>
                                        <svg data-v-362304c0="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path data-v-362304c0="" fill-rule="evenodd" clip-rule="evenodd" d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z" fill="#9499A0"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div data-loginwrapper="" class="green-login-register-wrapper">
                                <div data-loginwrapper="" class="universal-btn register-btn" onClick={handleRegisterClick}> Back </div>

                                {/* REGISTER BUTTON */}
                                {/* <div data-loginwrapper="" class="universal-btn login-btn"> Register </div> */}
                                <button
                                    data-loginwrapper=""
                                    class="universal-btn login-btn"
                                    disabled={loading}
                                >
                                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                                    Register </button>

                                {message && isDisplayPopUp && <div className="form-group">
                                    {notifyRegister(message)}
                                    {loginAfterRegister()}
                                </div>}

                                <CheckButton style={{
                                    display: "none"
                                }} ref={c => {
                                    checkBtn.current = c;
                                }} />

                            </div>

                        </Form>

                        <div data-thirdpartylogin="" data-loginwrapper="" class="third-party-login-wrapper" style={{height:"8vh"}}>
                            <div data-thirdpartylogin="" class="title"></div>
                            <div data-thirdpartylogin="" class="sns">
                                {/* <span data-thirdpartylogin="" class="btn google">Google</span>
                                <span data-thirdpartylogin="" class="btn facebook">Facebook</span> */}
                            </div>
                        </div>
                    </div>}

            </div>
            <div data-agreement="" data-bg="" class="green-agreement-wrapper">
                <div data-agreement="" class="green-agreement-content">
                    <p data-agreement="">CSD Project</p>
                    <p data-agreement="">the-green-investor 2022 <a data-agreement="" target="_blank" href="https://www.the-green-investor.com/licence.html"> user agreement </a>and <a data-agreement="" target="_blank" href="https://www.the-green-investor.com/privacy-pc.html"> privacy </a>
                    </p>
                </div>
            </div>

        </div>
    )

}

export default withRouter(Login2);