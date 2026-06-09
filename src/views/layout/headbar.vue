<template>
    <div id="app-header" class="app-header primary background">
        <div class="navbar">
            <Brand class="pull-left"></Brand>
            <div class="main-menu-li pull-left" style="margin-left: 50px">
                <el-row>
                    <el-menu
                        :popper-class="'headbar-submenu'"
                        class="headbar-menu"
                        menu-trigger="click"
                        ref="elmenu"
                        :default-active="'1'"
                        mode="horizontal"
                        :unique-opened="true"
                        @open="subMenuOpen"
                        @close="subMenuClose"
                        v-click-outside="clickOutsides"
                    >
                        <template v-for="(firstMenu, index) in menuList">
                            <el-menu-item
                                class="homne-router"
                                :class="{
                                    isAvtive:
                                        $route.path.split('/')[1] ===
                                            firstMenu.path.split('/')[1] ||
                                        $route.path === '/dashboard',
                                }"
                                :index="index + ''"
                                :key="firstMenu.id"
                                v-if="
                                    firstMenu.name &&
                                    firstMenu.name == $t('headbar.homePage')
                                "
                            >
                                <router-link :to="firstMenu.path">{{
                                    firstMenu.name
                                }}</router-link>
                            </el-menu-item>
                            <el-submenu
                                :class="{
                                    isAvtive:
                                        $route.path.split('/')[1] ===
                                        firstMenu.path.split('/')[1],
                                }"
                                :index="index + ''"
                                :key="index"
                                v-if="
                                    firstMenu.name &&
                                    firstMenu.name !== $t('headbar.homePage')
                                "
                            >
                                <template slot="title">{{
                                    firstMenu.name
                                }}</template>
                                <div
                                    :style="{ width: realWidth + 'px' }"
                                    :id="`menu-box${index}`"
                                    class="menu-box"
                                >
                                    <!-- <div class="menu-box" :style="setMenuBoxStyle"> -->
                                    <div ref="MenuBox">
                                        <div
                                            v-for="secondMenu in firstMenu.children"
                                            :key="secondMenu.id"
                                            class="second-name"
                                        >
                                            <template>
                                                <p>{{ secondMenu.name }}</p>
                                                <div
                                                    v-for="thirdMenu in secondMenu.children"
                                                    :key="thirdMenu.id"
                                                >
                                                    <span
                                                        v-if="!thirdMenu.hidden"
                                                        @click="
                                                            goRouter(index + '')
                                                        "
                                                    >
                                                        <p
                                                            v-if="
                                                                thirdMenu.menuType ==
                                                                1
                                                            "
                                                        >
                                                            {{ thirdMenu.name }}
                                                        </p>
                                                        <router-link
                                                            v-else
                                                            :class="{
                                                                avtive:
                                                                    $route.path ===
                                                                    thirdMenu.path,
                                                            }"
                                                            :to="thirdMenu.path"
                                                            >{{
                                                                thirdMenu.name
                                                            }}
                                                        </router-link>
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <i
                                        class="el-icon-close"
                                        @click="goRouter(index + '')"
                                    ></i>
                                </div>
                            </el-submenu>
                        </template>
                    </el-menu>
                </el-row>
            </div>
            <div
                class="nav navbar-nav pos-abt pos-r pos-t p-x z-i-1"
                style="z-index: 99"
            >
                <div
                    class="iconfont-box ai-box"
                    @click="showDeepSeek()"
                    v-if="enableBigData"
                >
                    <img src="/static/images/deepseek/ai_btn.svg" alt="" />
                    <span class="ai-text"> AI助理 </span>
                </div>
                <div class="iconfont-box">
                    <!-- 下载中心 -->
                    <i
                        id="download-task"
                        class="el-icon-download"
                        @click="openDownloadTask()"
                        :title="$t('headbar.downloadCenter')"
                    ></i>
                </div>
                <div class="iconfont-box" v-if="isShowCqmsIcon">
                    <!-- 意见反馈 -->
                    <i
                        class="iconfont icon-tousu"
                        @click="getCqmsUrl()"
                        :title="$t('headbar.feedback')"
                    ></i>
                </div>
                <div class="iconfont-box" v-if="authorityCenter">
                    <!-- 授权中心 -->
                    <img
                        src="/static/images/carCenter.png"
                        alt=""
                        @click="showJknDetail(false)"
                        :title="$t('headbar.authorityCenter')"
                        style="width: 20px"
                    />
                </div>
                <!-- 常见问题 -->
                <!-- <div class="iconfont-box">
                    <i
                        class="el-icon-question"
                        @click="getFAQUrl()"
                        :title="$t('headbar.frequentlyQuestions')"
                    ></i>
                </div> -->
                <div class="iconfont-box">
                    <!-- 全屏显示 -->
                    <img
                        src="/static/images/headbar/full-screen.svg"
                        :title="$t('headbar.fullScreenDisplay')"
                        @click="toggleScreen"
                        v-if="!screen"
                    />
                    <!-- 退出全屏 -->
                    <img
                        src="/static/images/headbar/cancel-full-screen.svg"
                        :title="$t('headbar.exitFullScreen')"
                        @click="toggleScreen"
                        v-else
                    />
                </div>
                <el-popover popper-class="myPopover" v-model="popoverShow">
                    <div class="infoBox" id="userInfo-popper" ref="userAction">
                        <div class="userInfo">
                            <div class="mainInfo">
                                {{ userInfo.name }}
                            </div>
                            <img
                                src="../../../static/images/headbar/pen.svg"
                                class="pointer"
                                @click="openEditUserModal"
                                v-if="isAdmin && !isVmp"
                            />
                            <div class="subInfo">
                                <span class="label-name">
                                    <!-- 姓名 -->
                                    {{ $t("headbar.nickName") }}:
                                </span>
                                <span
                                    class="value-name"
                                    :title="userInfo.nickName"
                                >
                                    {{ userInfo.nickName }}
                                </span>
                                <span class="label-name">
                                    <!-- 电话 -->
                                    {{ $t("headbar.phoneNo") }}:
                                </span>
                                <span
                                    class="value-phoneNo"
                                    :title="userInfo.phoneNo"
                                >
                                    {{ userInfo.phoneNo }}
                                </span>
                            </div>
                        </div>
                        <div class="b-bo" v-if="enableBigData">
                            <div
                                class="pointer infoitem"
                                @click="userAction('appImg')"
                            >
                                <img
                                    src="../../../static/images/headbar/qr_code.svg"
                                    class="img-style"
                                />
                                <!-- APP二维码 -->
                                {{ $t("headbar.appQRCode") }}
                            </div>
                            <div
                                class="pointer infoitem"
                                @click="userAction('user.gift')"
                            >
                                <img
                                    src="../../../static/images/headbar/queInvestigation.svg"
                                    class="img-style"
                                />
                                <!-- 调查问卷 -->
                                {{ $t("headbar.questionnaire") }}
                            </div>
                        </div>
                        <div class="b-bo">
                            <div
                                class="pointer infoitem"
                                @click="userAction('user.password')"
                            >
                                <img
                                    src="../../../static/images/headbar/changePass.svg"
                                    class="img-style"
                                />
                                <!-- 修改密码 -->
                                {{ $t("headbar.changePassword") }}
                            </div>
                        </div>
                        <div class="b-bo">
                            <div
                                class="pointer infoitem"
                                @click="userAction('about')"
                            >
                                <img
                                    src="../../../static/images/headbar/about.svg"
                                    class="img-style"
                                />
                                <!-- 关于 -->
                                {{ $t("headbar.about") }}({{ version }})
                            </div>
                            <div
                                class="pointer infoitem"
                                @click="userAction('logout')"
                            >
                                <img
                                    src="../../../static/images/headbar/login_out.svg"
                                    class="img-style"
                                />
                                <!-- 退出 -->
                                {{ $t("headbar.exit") }}
                            </div>
                        </div>
                    </div>
                    <el-button type="text" class="text-white" slot="reference">
                        <span>
                            <i
                                class="el-icon-user-solid"
                                style="font-size: 16px"
                            ></i>
                            <span class="m-r-xs" style="font-size: 12px">{{
                                userInfo.nickName != null
                                    ? userInfo.nickName
                                    : userInfo.name
                            }}</span>
                            <span class="el-icon-arrow-down"></span>
                        </span>
                    </el-button>
                </el-popover>
            </div>
        </div>

        <!-- 设备运维APP -->
        <el-dialog
            :title="$t('headbar.appQRCode')"
            :visible.sync="twoDimensionalCodeModal"
            :width="'400px'"
        >
            <div style="height: 400px">
                <div class="appDownloadImg_Modal">
                    <!-- APP 下载二维码 -->
                    <img :src="android_qr_url" :alt="$t('login.downloadApp')" />
                    <div>
                        <!-- 设备运维APP -->
                        {{ $t("login.equipmentApp") }}
                    </div>
                </div>
            </div>
            <div slot="footer"></div>
        </el-dialog>
        <!-- 设备运维APP/ -->

        <!-- 重置密码 -->
        <el-dialog
            :title="$t('headbar.changePassword')"
            :visible.sync="resetPasswordModal"
            :width="'340px'"
            custom-class="edit-user"
        >
            <div>
                <el-form
                    ref="resetPasswordForm"
                    :model="resetPasswordForm"
                    :rules="passwordformValidate"
                    label-width="100px"
                    label-position="top"
                >
                    <!-- 原密码 -->
                    <el-form-item
                        :label="$t('headbar.oldPassword')"
                        prop="oldPassword"
                    >
                        <el-input
                            v-model="resetPasswordForm.oldPassword"
                            type="password"
                            :placeholder="$t('headbar.oldPasswordPlaceholder')"
                            class="w-md"
                        ></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item
                        :label="$t('headbar.password')"
                        prop="password"
                    >
                        <el-input
                            v-model="resetPasswordForm.password"
                            type="password"
                            :placeholder="$t('headbar.passwordPlaceholder')"
                            class="w-md"
                            show-password
                            clearable
                            auto-complete="new-password"
                        ></el-input>
                    </el-form-item>
                    <!-- 确认密码 -->
                    <el-form-item
                        :label="$t('headbar.password2')"
                        prop="password2"
                    >
                        <el-input
                            v-model="resetPasswordForm.password2"
                            type="password"
                            :placeholder="$t('headbar.password2Placeholder')"
                            class="w-md"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="text" @click="resetCancel">
                    <!-- 取消 -->
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="doSavePassWord()"
                >
                    <!-- 确定 -->
                    {{ $t("common.ok") }}
                </el-button>
            </div>
        </el-dialog>
        <!-- 重置密码/ -->
        <!-- 设置密码/ -->
        <el-dialog
            title="设置密码"
            :visible.sync="editModal"
            @close="doCancel"
            :width="'520px'"
        >
            <div>
                <el-form
                    ref="editForm"
                    :model="editForm"
                    :rules="formValidate"
                    label-width="80px"
                >
                    <el-form-item label="密码" prop="pwd">
                        <el-input
                            v-model="editForm.pwd"
                            type="password"
                            placeholder="请输入密码"
                            class="w-md"
                            clearable
                        ></el-input>
                        <el-row
                            :gutter="1"
                            class="m-t-xs w-md text-center l-h-2x"
                            style="display: flex"
                        >
                            <el-col :span="6"
                                ><div
                                    :class="
                                        actLevel <= 0
                                            ? 'accent error'
                                            : 'accent'
                                    "
                                >
                                    风险
                                </div></el-col
                            >
                            <el-col :span="6"
                                ><div
                                    :class="
                                        actLevel == 1
                                            ? 'accent warning'
                                            : 'accent'
                                    "
                                >
                                    弱
                                </div></el-col
                            >
                            <el-col :span="6"
                                ><div
                                    :class="
                                        actLevel == 2 ? 'accent info' : 'accent'
                                    "
                                >
                                    中
                                </div></el-col
                            >
                            <el-col :span="6"
                                ><div
                                    :class="
                                        actLevel == 3
                                            ? 'accent success'
                                            : 'accent'
                                    "
                                >
                                    强
                                </div></el-col
                            >
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <div class="login-footer text-left m-t">
                <el-checkbox v-model="remember">不再提示</el-checkbox>
            </div>
            <div slot="footer">
                <el-button type="text" @click="doCancel">取消</el-button>
                <el-button type="primary" :loading="loading" @click="doSave()"
                    >确定</el-button
                >
            </div>
        </el-dialog>
        <!-- 设置密码/ -->
        <!-- 更新公告 -->
        <el-dialog
            title="平台升级维护通知"
            :visible.sync="sampleCollection"
            @close="doCancel"
            :width="'520px'"
        >
            <div>
                <p class="title">尊敬的客户：</p>
                <span class="content"
                    >为了向您提供更优质的服务，我公司将对平台进行升级维护，<span
                        class="showColor"
                        >{{
                            sampleCollectionData.type === 0
                                ? "届时无法使用平台功能"
                                : "届时不影响平台功能使用"
                        }}</span
                    >。</span
                >
                <p class="title">平台更新时间：</p>
                <span
                    :class="{ showColor: sampleCollectionData.type === 0 }"
                    class="content"
                    >{{
                        sampleCollectionData.startTime +
                        "-" +
                        sampleCollectionData.endTime
                    }}</span
                >
                <p class="title">平台本次升级内容：</p>
                <span
                    class="content"
                    v-for="(item, index) in sampleCollectionData.contentArr"
                    :key="index"
                    >{{ item }}</span
                >
            </div>
            <div slot="footer">
                <el-button @click="sampleCollection = false">知道了</el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" v-model="jknBoolean" :title="jknTitle">
            <div>
                <p class="titleJkn">尊敬的客户：</p>
                <div>
                    <span v-if="jknDue" class="contentJkn"
                        >您购买的车辆授权，有<span class="showColorJkn"
                            >{{ jknCarNums }}台</span
                        >已经到期，建议及时续费或将足够车辆设为“不续费”状态，否则将无法使用平台。</span
                    >
                    <span v-if="!jknDue" class="contentJkn"
                        >您购买的车辆授权，将有<span class="noColorJkn"
                            >{{ jknCarNums }}台</span
                        >在30天内到期，到期后我们会对车辆进行下线处理，为了不影响您的业务，建议及时续费或将足够车辆设为“不续费”状态。</span
                    >
                    <span class="contentJkn">详情可咨询本地分公司销售。</span>
                </div>
            </div>
            <div slot="footer">
                <el-button v-if="!jknDue" @click="jknBoolean = false"
                    >知道了</el-button
                >
                <el-button
                    v-if="!jknDue"
                    type="primary"
                    @click="showJknDetail(true)"
                    >详情</el-button
                >
                <el-button
                    v-if="jknDue"
                    type="primary"
                    @click="showJknDetail(false)"
                    >去处理</el-button
                >
            </div>
        </el-dialog>
        <!-- 修改账户名 -->
        <el-dialog
            title="修改账户名"
            :visible.sync="resetUsernameModal"
            :width="'520px'"
        >
            <div>
                <el-form
                    ref="formUsername"
                    :model="formUsername"
                    :rules="ruleFormUsername"
                >
                    <el-form-item prop="oldUsername" label="原账户名">
                        <el-input
                            type="text"
                            v-model="formUsername.oldUsername"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="newUsername" label="新账户名">
                        <el-input
                            type="text"
                            v-model="formUsername.newUsername"
                            placeholder="请输入新账户名"
                        ></el-input>
                        <span
                            v-if="isRight"
                            style="color: #b3b3b3 !important"
                            class="ivu-form-item-error-tip"
                            >只允许输入字母和数字，须以字母开头</span
                        >
                    </el-form-item>
                    <el-form-item prop="password" label="用户密码">
                        <el-input
                            type="password"
                            v-model="formUsername.password"
                            placeholder="请输入用户密码"
                            :readonly="readonly"
                            @mousedown.native="mouseDown"
                            @focus="onFocus"
                            @blur="onBlur"
                            @change="onChange"
                        ></el-input>
                        <!-- <span v-show="pwdError" class="inputError">密码不正确</span> -->
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="default" @click="resetUsernameModal = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="ok()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 修改手机号码 -->
        <el-dialog
            title="修改手机号码"
            :visible.sync="resetPhoneModal"
            :width="'420px'"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    ref="formPhone"
                    :model="formPhone"
                    :rules="ruleFormPhone"
                >
                    <el-form-item prop="phone">
                        <el-input
                            type="text"
                            v-model="formPhone.phone"
                            placeholder="新手机号码"
                            clearable
                        >
                            <span slot="prepend">+86</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-row :gutter="4">
                            <el-col :span="16">
                                <el-input
                                    v-model="formPhone.veryCode"
                                    type="text"
                                    placeholder="验证码"
                                    autoComplete="on"
                                ></el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-button
                                    style="width: 126px"
                                    :disabled="blackTime > 0"
                                    @click.native.prevent="getNewPhoneCode"
                                    v-show="blackTime <= 0"
                                    >获取验证码</el-button
                                >
                                <el-button
                                    class="text-info text-sm"
                                    style="width: 126px"
                                    :disabled="blackTime > 0"
                                    v-show="blackTime > 0"
                                    >{{ blackTime }} s</el-button
                                >
                                <!-- <span class="pull-right blackTime text-info text-sm" v-show="blackTime > 0">{{blackTime}} s</span> -->
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="default" @click="resetPhoneModal = false"
                    >取消</el-button
                >
                <el-button type="primary" @click="modifyPhone()"
                    >确定</el-button
                >
            </div>
        </el-dialog>
        <!-- 编辑用户 -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editUserModal"
            :width="'600px'"
            :close-on-click-modal="false"
        >
            <div style="max-height: 600px" class="scrollable scrollable-xs">
                <el-form
                    ref="editUserForm"
                    :model="editUserForm"
                    :rules="editUserFormValidate"
                    label-width="155px"
                >
                    <el-form-item label="账户名" prop="name">
                        <el-input
                            v-model.trim="editUserForm.name"
                            :maxlength="16"
                            :minlength="3"
                            type="text"
                            placeholder="请输入账户名"
                            style="width: 280px"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="nickName">
                        <el-input
                            v-model.trim="editUserForm.nickName"
                            :maxlength="16"
                            type="text"
                            placeholder="请输入姓名"
                            style="width: 280px"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phoneNo">
                        <el-input
                            v-model.trim="editUserForm.phoneNo"
                            type="text"
                            maxlength="18"
                            :disabled="true"
                            placeholder="请输入手机号码"
                            style="width: 280px"
                            clearable
                        ></el-input>
                        <el-button class="m-l-sm" @click="resetPhone"
                            >重置手机</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="text" @click="editUserModal = false"
                    >取消</el-button
                >
                <el-button
                    type="primary"
                    :loading="loading"
                    @click="doSaveEditUserForm()"
                    >确定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title=" "
            :visible.sync="logoutVisible"
            width="400px"
            @close="getUserInfo"
        >
            <span class="logout-msg"
                ><i class="el-icon-success" style="color: #67c23a"></i
                >用户信息修改成功，请重新登录！</span
            >
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="logoutVisible = false"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 常见问题 -->
        <el-dialog
            :title="$t('headbar.frequentlyQuestions')"
            :visible.sync="faqVisible"
            :fullscreen="true"
            :custom-class="'faq-file'"
        >
            <div ref="faqFile"></div>
        </el-dialog>
        <!-- 关于 -->
        <el-dialog
            :visible.sync="aboutVisible"
            :title="$t('headbar.about')"
            width="640px"
            :close-on-click-modal="false"
            @close="aboutClosed"
            class="about-dialog"
        >
            <el-row>
                <div class="about-top">
                    <div class="logo">
                        <img :src="state.app.logo" alt="logo" />
                    </div>
                    <div class="name">
                        <div class="platform-name">{{ state.app.name }}</div>
                        <div class="platform-version">
                            <!-- 版本信息 -->
                            {{
                                $t("conditionMonitoring.versionInformation")
                            }}：{{ version }}
                        </div>
                    </div>
                </div>
                <div class="about-bottom">
                    <div class="word left" @click="goService">
                        <img src="/static/images/word_icon.png" alt="logo" />
                        <span>《用户服务协议》</span>
                    </div>
                    <div class="word" @click="goPolicy">
                        <img src="/static/images/word_icon.png" alt="logo" />
                        <span>《隐私策略》</span>
                    </div>
                </div>
            </el-row>
        </el-dialog>
        <!-- 下载中心 -->
        <el-dialog
            :title="$t('headbar.downloadCenter')"
            :visible.sync="downloadVisible"
            :fullscreen="true"
            custom-class="download-task-dialog"
        >
            <div slot="title" class="download-task-title">
                <h2>
                    <!-- 下载中心 -->
                    {{ $t("headbar.downloadCenter") }}
                </h2>
                <el-button
                    icon="el-icon-close"
                    type="text"
                    @click="downloadVisible = false"
                >
                    <!-- 关闭 -->
                    {{ $t("common.close") }}
                </el-button>
            </div>
            <download-task v-if="downloadVisible"></download-task>
        </el-dialog>
        <deepseek @close="showDeepSeek" v-show="isShowDeepseek"></deepseek>
    </div>
</template>
<style>
.appDownloadImg_Modal {
    margin: 30px;
    float: left;
}
.appDownloadImg_Modal img {
    width: 300px;
}
.appDownloadImg_Modal div {
    font-size: 16px;
    font-weight: 900;
    text-align: center;
}
</style>
<script>
// import clickOutside from 'v-click-outside'
import Auth from "@/utils/auth";
import { mapGetters } from "vuex";
import Brand from "@/components/brand.vue";
import downloadTask from "./downloadTask.vue";
import {
    checkStrong,
    validatePhoneNo,
    validateNoChinese,
    validateNumberAndEnglish,
    validateExpectSpecial,
    validateNumberAndEnglishStartWithEnglish,
    validateNumber,
    validateNumLetterSpecial,
} from "@/utils/validate";
import AES from "@/utils/secret";
import VideoControl from "../maintenanceCenter/configurationDetail/fileConfig.vue";
let sha256 = require("js-sha256").sha256;
// 引入axios用来发请求
import axios from "axios";
// 引入docx-preview插件
let docx = require("docx-preview");
import deepseek from "@/views/deepseek/deepseek.vue";
export default {
    name: "headbar",
    components: {
        Brand,
        VideoControl,
        downloadTask,
        deepseek,
    },
    watch: {
        "$route.path": {
            handler(oldPath, newPath) {
                if (
                    newPath.split("/").length == 2 ||
                    oldPath.split("/").length == 2
                ) {
                    this.$store.dispatch("RemoveDeviceManageId");
                    this.$store.dispatch("RemoveDeviceUpgradeId");
                    this.$store.dispatch("RemoveDeviceConfigurationId");
                    this.$store.dispatch("RemoveCondition");
                    this.$store.dispatch("RemoveShowSearchForm");
                    this.$store.dispatch("RemoveShowDeviceManageId");
                    this.$store.dispatch("RemoveTabName");
                    this.$store.dispatch("RemoveTime");
                    this.$store.dispatch("RemoveDeviceFaultId");
                    this.$store.dispatch("RemoveCurrentType");
                    this.$store.dispatch("RemoveCurrentIndex");
                    this.$store.dispatch("RemoveDate");
                    this.$store.dispatch("RemoveMonth");
                    this.$store.dispatch("RemoveAntIrotationId");
                } else {
                    if (newPath.split("/")[2] != oldPath.split("/")[2]) {
                        this.$store.dispatch("RemoveDeviceManageId");
                        this.$store.dispatch("RemoveDeviceUpgradeId");
                        this.$store.dispatch("RemoveDeviceConfigurationId");
                        this.$store.dispatch("RemoveCondition");
                        this.$store.dispatch("RemoveShowSearchForm");
                        this.$store.dispatch("RemoveShowDeviceManageId");
                        this.$store.dispatch("RemoveTabName");
                        this.$store.dispatch("RemoveTime");
                        this.$store.dispatch("RemoveDeviceFaultId");
                        this.$store.dispatch("RemoveCurrentType");
                        this.$store.dispatch("RemoveCurrentIndex");
                        this.$store.dispatch("RemoveDate");
                        this.$store.dispatch("RemoveMonth");
                        this.$store.dispatch("RemoveAntIrotationId");
                    }
                }
            },
        },
        popoverShow(val) {
            this.$store.commit("setIsShowUserInfo", val);
        },
        downloadVisible(val) {
            this.$store.commit("setIsShowDownLoad", val);
        },
    },
    mounted() {
        this.activeName = this.$route.name;
        this.realWidth = document.getElementById("app-header").clientWidth;
        if (!localStorage.getItem("firstLogin")) {
            this.getLastLoginIpInfo();
            localStorage.setItem("firstLogin", 1);
        }
    },
    // directives:{
    //   clickOutside
    // },
    data() {
        const resetValidatePassCheck = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("密码不能为空"));
            } else if (value != this.resetPasswordForm.password) {
                callback(new Error("两次密码不一致"));
            } else {
                callback();
            }
        };
        const checkPassStrong = (rule, value, callback) => {
            if (!value) {
                callback(new Error("密码不能为空"));
            } else if (!validateNumLetterSpecial(value)) {
                callback(new Error("仅能输入数字、字母、英文特殊字符"));
            } else {
                this.actLevel = checkStrong(value, this.userInfo.name);
                if (this.actLevel < this.passLevel) {
                    callback(new Error("密码强度过低"));
                }
                callback();
            }
        };
        const checkUsername = (rule, value, callback) => {
            if (value == "") {
                this.isRight = false;
                callback(new Error("请输入新账户名"));
                return;
            } else if (!validateNumberAndEnglishStartWithEnglish(value)) {
                callback(new Error("只允许输入字母和数字，须以字母开头"));
            } else {
                this.isRight = true;
                callback();
            }
        };
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error("手机号码不能为空"));
            } else if (value.length != 11 || !validatePhoneNo(value)) {
                callback(new Error("不是有效的手机号码"));
            } else {
                callback();
            }
        };
        const checkVeryCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error("验证码不能为空"));
            } else if (value.length < 4) {
                callback(new Error("验证码长度不能小于4位"));
            } else {
                callback();
            }
        };
        const checkName = (rule, value, callback) => {
            if (value) {
                if (validateNumberAndEnglishStartWithEnglish(value)) {
                    callback();
                } else {
                    callback(
                        new Error("账户名只允许输入英文、数字、下划线和@")
                    );
                }
            } else {
                callback(new Error("账户名不能为空"));
            }
        };
        const checkNickName = (rule, value, callback) => {
            if (value) {
                if (validateExpectSpecial(value)) {
                    callback();
                } else {
                    callback(new Error("只允许输入中英文和数字"));
                }
            } else {
                callback();
            }
        };
        // 检验只能是数字
        const checkDateNumberRoadNUm = (rule, value, callback) => {
            if (value) {
                if (validateNumber(value)) {
                    callback();
                } else {
                    callback(new Error(this.$t("message.numbers_only")));
                }
            } else {
                callback();
            }
        };
        const checkPhoneNo = (rule, value, callback) => {
            if (value) {
                if (value.length == 11 && validatePhoneNo(value)) {
                    callback();
                } else {
                    callback(new Error(this.$t("message.phoneNumber_invalid")));
                }
            } else {
                callback();
            }
        };
        return {
            enableBigData: false,
            mapKey: "",
            hostname: window.location.hostname,
            aboutVisible: false,
            logoutVisible: false,
            faqVisible: false,
            downloadVisible: false,
            popoverShow: false,
            showIcon: false,
            version: "",
            platformType: localStorage.getItem("platformType"),
            jknBoolean: false,
            jknGoUrl: false,
            jknTitle: "",
            jknCarNums: "",
            jknDue: false,
            menuList: [],
            enableSMS: true,
            enableQRLogin: true,
            blackTime: 0, //验证码倒计时60s
            resetPhoneModal: false,
            formPhone: {
                veryCode: "",
                phone: "",
            },
            ruleFormPhone: {
                phone: [
                    { required: true, trigger: "blur", validator: checkPhone },
                ],
                veryCode: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: checkVeryCode,
                    },
                ],
            },
            alarmCount: 0,
            refreshSessionHandle: null,
            activeName: "管理面板",
            showSecond: true,
            resetPasswordModal: false,
            resetUsernameModal: false,
            formUsername: {
                oldUsername: "",
                newUsername: "",
                password: "",
            },
            ruleFormUsername: {
                newUsername: [
                    {
                        required: true,
                        validator: checkUsername,
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入用户密码",
                        trigger: "blur",
                    },
                ],
            },
            isRight: true,
            pwdError: false,
            readonly: true,
            screen: false,
            loading: false,
            routerUrl: "",
            hoverIndex: -1,
            firstMenuId: -1,
            thirdMenuId: -1,
            subMenuIndex: 1,
            realWidth: 0,
            visible2: false,
            resetPasswordForm: {
                oldPassword: "",
                password: "",
                password2: "",
            },
            tanentId: "",
            userId: "",
            editForm: { pwd: "" },
            editModal: false,
            sampleCollection: false,
            sampleCollectionData: "",
            remember: false,
            actLevel: 0,
            passLevel: 3,
            twoDimensionalCodeModal: false,
            android_qr_url: "",
            ios_qr_url: "",
            passwordformValidate: {
                oldPassword: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                    { validator: checkPassStrong, trigger: "blur" },
                    { validator: checkPassStrong, trigger: "change" },
                ],
                password2: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                    { validator: resetValidatePassCheck, trigger: "blur" },
                ],
            },
            formValidate: {
                pwd: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 8,
                        max: 20,
                        message: "密码长度必须在8~20个字符以内",
                        trigger: "blur",
                    },
                    { validator: checkPassStrong, trigger: "change" },
                    { validator: checkPassStrong, trigger: "blur" },
                ],
            },
            userType: null, //判断是否为运维总账号
            canModifyPhone: false, //修改手机号码
            canModifyName: false, //修改账户名
            dSubAK: null,
            isShowCqmsIcon: false,
            userInfo: {},
            isAdmin: false,
            isVmp: false,
            editUserModal: false,
            copyEditUserForm: {},
            editUserForm: {
                name: "",
                nickName: "",
                phoneNo: "",
            },
            editUserFormValidate: {
                name: [
                    {
                        required: true,
                        message: "账户名不能为空",
                        trigger: "blur",
                    },
                    {
                        type: "string",
                        min: 4,
                        max: 16,
                        message: "账户名长度不能小于4个字符，大于16个字符",
                        trigger: "blur",
                    },
                    { validator: checkName, trigger: "blur" },
                ],
                nickName: [
                    {
                        required: true,
                        message: "姓名不能为空",
                        trigger: "blur",
                    },
                    {
                        required: true,
                        type: "string",
                        min: 1,
                        max: 16,
                        message: "姓名长度必须在1~16个字符以内",
                        trigger: "blur",
                    },
                    { validator: checkNickName, trigger: "blur" },
                ],
                phoneNo: [
                    {
                        required: true,
                        message: "手机号码不能为空",
                        trigger: "blur",
                    },
                    {
                        required: true,
                        type: "string",
                        min: 1,
                        max: 18,
                        message: "手机号码长度必须在1~18个字符以内",
                        trigger: "blur",
                    },
                    { validator: checkDateNumberRoadNUm, trigger: "blur" },
                    { validator: checkPhoneNo, trigger: "blur" },
                ],
            },
            omsLanguage: this.$i18n.locale,
            languageList: [
                //语言列表
                {
                    value: "zh-CN",
                    name: "中文",
                },
                {
                    value: "en-US",
                    name: "English",
                },
            ],
            isShowDeepseek: false,
        };
    },
    computed: {
        ...mapGetters([
            "username",
            "nickname",
            "permission_routers",
            "authorityCenter",
        ]),
        state() {
            return this.$store.state.app;
        },
    },
    created() {
        const flag = Number(localStorage.getItem("enableBigData"));
        if (flag == 0) {
            this.enableBigData = true;
        } else if (flag == 1) {
            this.enableBigData = false;
        }
        this.$store.dispatch("RemoveCondition");
        this.$store.dispatch("RemoveTime");
        this.menuList = this.permission_routers;
        this.getUserInfo();
        this.getAppDownloadImg();
        // this.getIsUpgrading();
        this.basicSettings();
        this.getOverdueInfo();
        this.getVersion();
        this.getCqmsIcon();
        this.checkIconShow();
        let path = this.$route.path.split("/");
        this.$store.dispatch("changChildMenu", {
            params: "/" + path[1],
        });
        let params = { parameterName: "LowestLevelOfPassSecurity" };
        // this.$api.getSysInfoValue(params).then((res) => {
        //     if (res.success == true) {
        //         this.passLevel = res.data.value;
        //     }
        // });
        //监听F11功能键
        let _this = this;
        document.onkeydown = function (e) {
            if (e.key == "F11") {
                _this.toggleScreen();
                return false;
            }
            if (e.key == "Escape" && _this.screen) {
                _this.toggleScreen();
                return false;
            }
        };
        // window.onresize = function() {

        // }
        window.addEventListener("resize", () => {
            if (_this.isFullscreen()) {
                _this.screen = true;
            } else {
                _this.screen = false;
            }
            _this.realWidth = document.getElementById("app-header").clientWidth;
        });
        this.getUserTypeInfo();
        this.checkUserTypeWhetherVMP();
        let wordList = [
            { key: "enterprise", originName: "企业", newName: "企业" },
            { key: "carTeam", originName: "关注车队", newName: "关注车队" },
            { key: "gps", originName: "GPS", newName: "GPS" },
        ];
        let obj = {};
        wordList.map((item) => {
            obj[item.key] = item.newName;
        });
        this.$store.commit("SET_WORDOBJ", obj);
        localStorage.setItem("wordObj", JSON.stringify(obj));
    },
    methods: {
        getUserTypeInfo() {
            this.$api.getUserTypeInfo().then((res) => {
                if (res.success == true) {
                    this.isAdmin = res.data.type === 2;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        checkUserTypeWhetherVMP() {
            this.$api.checkUserTypeWhetherVMP().then((res) => {
                if (res.success == true) {
                    this.isVmp = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //显示CQMS 按钮
        getCqmsIcon() {
            this.$api.getCqmsIcon().then((res) => {
                if (res.success == true) {
                    this.isShowCqmsIcon = res.data;
                }
            });
        },
        //获取访问链接
        getCqmsUrl() {
            this.$api.getCqmsUrl().then((res) => {
                if (res.success == true) {
                    window.open(res.data);
                }
            });
        },
        //获取APP下载二维码
        getVersion() {
            this.$api.getVersion().then((res) => {
                if (res.success == true) {
                    this.version = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取车辆授权期限
        showJknDetail(bol) {
            this.$api.getJknRedirectUrl().then((res) => {
                if (res.success) {
                    if (bol) {
                        this.jknBoolean = false;
                    }
                    window.open(res.data.url + "?upc=" + Auth.getToken());
                } else {
                    this.$message.error(`跳转失败:${res.msg}`);
                }
            });
        },
        openDownloadTask() {
            this.downloadVisible = true;
        },
        getOverdueInfo() {
            this.$api.getOverdueInfo().then((res) => {
                if (res.success) {
                    this.jknDue = res.data.due;
                    this.jknCarNums = res.data.overdueDeviceNum;
                    this.jknTitle = res.data.due
                        ? "车辆授权到期提醒"
                        : "车辆授权续费提醒";
                    //是否已过期-已有到期必提醒，还有使用期限的弹窗则判断授权数量不够和非车辆平台跳转的同时成立
                    if (this.platformType && this.platformType == 1) {
                        this.jknBoolean = false;
                    } else {
                        this.jknBoolean =
                            res.data.due || !res.data.renewNumEnough;
                    }

                    this.jknGoUrl = res.data.renewNumEnough;
                    //renewNumEnough
                } else {
                    this.$message.error(`获取车辆授权信息失败：${res.msg}`);
                }
            });
        },
        //基础配置
        basicSettings() {
            this.$api.basicSettings().then((res) => {
                if (res.success == true) {
                    this.enableSMS = res.data.enableSMS;
                    this.enableQRLogin = res.data.enableQRLogin;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取新手机号验证码
        getNewPhoneCode() {
            if (this.formPhone.phone == "") {
                this.$message.error("手机号码不能为空！");
                return;
            }
            this.$api
                .getModifyPhoneVeryCode(this.formPhone.phone)
                .then((res) => {
                    if (res.success == true) {
                        this.$message.success("短信发送成功");
                        this.blackTime = 60;
                        let timeInterval = setInterval(() => {
                            this.blackTime = this.blackTime - 1;
                            if (this.blackTime == 0) {
                                clearInterval(timeInterval);
                            }
                        }, 1000);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        //修改手机号码
        modifyPhone() {
            this.$refs.formPhone.validate((valid) => {
                if (valid) {
                    this.$api.updatePhone(this.formPhone).then((res) => {
                        if (res.success == true) {
                            this.$message.success("手机号码修改成功!");
                            this.resetPhoneModal = false;
                            this.getUserInfo(true);
                        } else {
                            this.$message.error("修改失败：" + res.msg);
                        }
                    });
                }
            });
        },
        ok() {
            this.$refs.formUsername.validate((valid) => {
                if (valid) {
                    let params = {
                        name: this.formUsername.newUsername,
                        password: sha256(this.formUsername.password),
                    };
                    this.$api.updateName(params).then((res) => {
                        if (res.success == true) {
                            this.resetUsernameModal = false;
                            this.$store.commit(
                                "SET_NAME",
                                this.formUsername.newUsername
                            );
                            this.$message.success(
                                "账户名修改成功!请重新登录。"
                            );
                            localStorage.removeItem("otatoken");
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        } else {
                            this.$message.error("修改失败：" + res.msg);
                        }
                    });
                }
            });
        },
        //修改手机号码
        resetPhone() {
            this.resetPhoneModal = true;
            this.$nextTick(() => {
                this.handleReset("formPhone");
                this.formPhone.veryCode = "";
                this.blackTime = 0;
            });
        },
        //修改账户名
        resetUsername() {
            this.resetUsernameModal = true;
            this.$nextTick(() => {
                this.handleReset("formUsername");
                this.isRight = true;
                this.formUsername.oldUsername = this.username;
            });
        },
        //以下四个事件用以解决账户名密码自动填充问题
        onFocus(event) {
            setTimeout(() => {
                event.target.readOnly = false;
                // this.readonly = false;
            }, 100);
        },
        onBlur(event) {
            event.target.readOnly = true;
            //this.readonly = true;
        },
        //解决输入密码后全部清除时出现自动下拉框的问题
        onChange(event) {
            if (event.target.value == "") {
                this.onBlur(event);
                this.onFocus(event);
            }
        },
        //解决鼠标多点几次出现自动下拉框问题
        mouseDown(event) {
            this.onBlur(event);
            this.onFocus(event);
        },
        goOtherMenu(thirdMenu, menuList) {
            this.routerUrl = menuList.path + "/" + thirdMenu.path;
            this.visible2 = false;
        },
        goRouter(index) {
            this.$refs.elmenu && this.$refs.elmenu.close(index);
            this.$store.commit("setIsShowMenu", false);
            localStorage.setItem("setIsShowMenu", false);
        },
        goDashboard() {
            this.firstMenuId = -1;
            this.thirdMenuId = -1;
            if (this.permission_routers.length) {
                this.permission_routers.forEach((item, index) => {
                    if (item["name"] == this.$t("headbar.homePage")) {
                        this.hoverIndex = index;
                    }
                });
            }
        },
        subMenuOpen(index) {
            this.$store.commit("setIsShowMenu", false);
            this.subMenuIndex = index;
            setTimeout(() => {
                this.$store.commit("setIsShowMenu", true);
                this.$store.commit("setMenuIndex", index);
            }, 1);
        },
        subMenuClose() {
            this.$store.commit("setIsShowMenu", false);
        },
        clickOutsides() {
            this.$refs.elmenu.close(this.subMenuIndex);
            localStorage.setItem("setIsShowMenu", false);
            this.$store.commit("setIsShowMenu", false);
        },
        changeRouter(event, item, index) {
            this.menuList = item;
            this.visible2 = true;
        },
        onMenuSelected(item) {
            this.$store.dispatch("changChildMenu", {
                params: item.path,
            });
            if (item.path === "/") {
                this.$router.push({ path: "/dashboard" });
            } else {
                if (!!item.children.length) {
                    this.$router.push({
                        path: item.path + "/" + item.children[0].path,
                    });
                }
            }
        },
        toggleSearch() {
            this.$store.dispatch("searchFilter", {
                params: this.$route,
            });
        },
        openSideBar() {
            this.$store.dispatch("OpenSideBar");
            document.body.classList.add("modal-open");
            const backdrop = document.createElement("div");
            backdrop.classList.add("modal-backdrop");
            backdrop.classList.add("in");
            document.body.appendChild(backdrop);
        },
        toggleScreen() {
            if (!this.screen) {
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                } else {
                    this.$message.error({
                        content: "除了让你升级浏览器，没什么好说的！",
                        duration: 3,
                    });
                }
                this.screen = true;
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else {
                    this.$message.error({
                        content: "请升级浏览器，不然我是不会理你的！",
                        duration: 3,
                    });
                }
                this.screen = false;
            }
        },
        /**
         * [isFullscreen 判断浏览器是否全屏]
         * @return [全屏则返回当前调用全屏的元素,不全屏返回false]
         */
        isFullscreen() {
            return (
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                false
            );
        },
        userAction(name) {
            switch (name) {
                case "user.profile":
                    this.$router.push({ path: "/user/profile" });
                    break;
                case "user.password":
                    this.resetPassword();
                    break;
                case "user.username":
                    this.resetUsername();
                    break;
                case "user.gift":
                    this.$api.getQuestionnaireSurveyUrl().then((res) => {
                        if (res.success == true) {
                            window.open(res.data, "_blank");
                        }
                    });
                    break;
                case "user.phone":
                    this.resetPhone();
                    break;
                case "user.shortcut":
                    this.$router.push({ path: "/user/shortcut" });
                    break;
                case "download.app":
                    this.$router.push({ path: "/download/app" });
                    break;
                case "download.plugin":
                    this.downloadOcx();
                    break;
                case "appImg":
                    this.twoDimensionalCodeModal = true;
                    break;
                case "about":
                    this.aboutVisible = true;
                    break;
                case "logout":
                    this.$store.dispatch("LogOut").then(() => {
                        localStorage.removeItem("dSubAk");
                        localStorage.removeItem("userHdcType");
                        location.reload(); // 为了重新实例化vue-router对象 避免bug
                        VideoControl.refresh();
                    });
                    break;
            }
        },
        aboutClosed() {
            this.aboutVisible = false;
        },
        goService() {
            window.open("/#/serviceAgreement");
        },
        goPolicy() {
            window.open("/#/privacyPolicy");
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        resetCancel() {
            this.resetPasswordModal = false;
        },
        resetPassword() {
            this.resetPasswordModal = true;
            this.$nextTick(() => {
                this.handleReset("resetPasswordForm");
                let params = { parameterName: "LowestLevelOfPassSecurity" };
                // this.$api.getSysInfoValue(params).then((res) => {
                //     if (res.success == true) {
                //         this.passLevel = res.data.value;
                //     }
                // });
            });
        },
        //修改密码
        doSavePassWord() {
            this.$refs.resetPasswordForm.validate((valid) => {
                if (valid) {
                    if (this.actLevel < this.passLevel) {
                        this.$message.error("密码强度太低！");
                        return;
                    }
                    this.loading = true;
                    let form = {};
                    form.password = sha256(this.resetPasswordForm.password);
                    form.oldPassword = sha256(
                        this.resetPasswordForm.oldPassword
                    );
                    this.$api.updatePassword(form).then((res) => {
                        if (res.success == true) {
                            this.loading = false;
                            this.resetPasswordModal = false;
                            this.logoutVisible = true;
                        } else {
                            this.loading = false;
                            this.$message.error("修改密码失败");
                        }
                    });
                } else {
                    this.loading = false;
                    return false;
                }
            });
        },
        //获取更新公告
        getIsUpgrading() {
            this.$api.getIsUpgrading().then((res) => {
                if (res.success) {
                    if (res.data) {
                        res.data.contentArr = res.data.content.split(" ");
                        this.sampleCollectionData = res.data;
                        this.sampleCollection = true;
                    }
                } else {
                    // this.$message.error('获取更新公告失败' + res.msg)
                }
            });
        },
        doCancel() {
            if (this.remember == true) {
                this.$api.setIgnoreHdcUserPwd().then((res) => {
                    if (res.success == true) {
                        this.$message.success("设置不提醒成功");
                        this.editModal = false;
                    } else {
                        this.$message.error("设置不提醒失败" + res.msg);
                    }
                });
            }
            this.setHdcUserInfoNeedRemind();
        },
        jknCancel() {},
        doSave() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let sha256 = require("js-sha256").sha256;
                    let p = sha256(this.editForm.pwd);
                    let formData = { pwd: p };
                    this.$api.setHdcUserPwd(formData).then((res) => {
                        if (res.success == true) {
                            //this.loading = false;
                            this.editModal = false;
                            this.$message.success("设置密码成功");
                        } else {
                            //this.loading = false;
                            this.$message.error("设置密码失败：" + res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        getUserInfo(bol) {
            this.$api.getHdcUserInfo().then((res) => {
                if (res.success == true) {
                    localStorage.setItem("dSubAk", res.data.dSubAK);
                    localStorage.setItem("userHdcType", res.data.type);
                    localStorage.setItem(
                        "userSubType",
                        res.data.subType || 999
                    );
                    this.$store.dispatch(
                        "setUserSubType",
                        res.data.subType || 999
                    );
                    this.userInfo = { ...res.data };
                    this.copyEditUserForm = { ...res.data };
                    this.dSubAK = res.data.dSubAK;
                    this.canModifyName = res.data.canModifyName;
                    this.canModifyPhone = res.data.canModifyPhone;
                    this.userType = res.data.type;
                    this.tanentId = res.data.tanentId;
                    this.userId = res.data.id;
                    if (res.data.type == 4 && res.data.needRemind == 1) {
                        this.editModal = true;
                    }
                    if (bol) {
                        this.editUserForm.name = this.userInfo.name;
                        this.editUserForm.nickName = this.userInfo.nickName;
                        this.editUserForm.phoneNo = this.userInfo.phoneNo;
                    }
                } else {
                    this.$message.error("获取用户信息失败" + res.msg);
                }
            });
        },
        setHdcUserInfoNeedRemind() {
            this.$api.setHdcUserInfoNeedRemind().then((res) => {
                if (res.success == true) {
                    //this.$message.success('设置成功')
                    this.editModal = false;
                } else {
                    //this.$message.error('执行失败' + res.msg)
                }
            });
        },
        //获取APP下载二维码
        getAppDownloadImg() {
            this.$api.getAppDownloadImg().then((res) => {
                if (res.success == true) {
                    let data = res.data;
                    this.android_qr_url = data.android_qr;
                    this.ios_qr_url = data.ios_qr;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        checkIconShow() {
            this.$api.checkIconShow().then((res) => {
                if (res.success == true) {
                    this.showIcon = res.data.showIcon;
                } else {
                    this.$message.error("设置不提醒失败" + res.msg);
                }
            });
        },
        //切换用户操作下拉框是否显示
        changeVisible(val) {
            if (val) {
                //获取用户中心的高度
                this.$nextTick(() => {
                    this.$store.commit("setUserActionOpen", true);
                });
            } else {
                this.$store.commit("setUserActionOpen", false);
            }
        },
        getFAQUrl() {
            this.$api.getFAQUrl().then((res) => {
                if (res.success == true) {
                    // window.open(res.data, "_blank");
                    axios({
                        method: "get",
                        responseType: "blob", // 因为是流文件，所以要指定blob类型
                        url: res.data, // 自己的服务器，提供的一个word下载文件接口
                    }).then(({ data }) => {
                        this.faqVisible = true;
                        setTimeout(() => {
                            docx.renderAsync(data, this.$refs.faqFile); // 渲染到页面
                        }, 300);
                    });
                }
            });
        },
        // 安装
        downloadOcx() {
            this.$api.getBinFileConfigDownloadUrl().then((res) => {
                let url = "";
                if (res.success && !!res.data) {
                    url = res.data;
                    let elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                    setTimeout(() => {
                        document.body.removeChild(elemIF);
                    }, 2000);
                } else {
                    this.$message.error("获取控件URL失败:" + res.msg);
                }
            });
        },
        openEditUserModal() {
            this.editUserForm.name = this.userInfo.name;
            this.editUserForm.nickName = this.userInfo.nickName;
            this.editUserForm.phoneNo = this.userInfo.phoneNo;
            this.editUserModal = true;
        },
        doSaveEditUserForm() {
            this.$refs.editUserForm.validate((valid) => {
                if (!valid) {
                    return;
                }
                if (
                    this.copyEditUserForm.name !== this.editUserForm.name ||
                    this.copyEditUserForm.nickName !==
                        this.editUserForm.nickName
                ) {
                    this.loading = true;
                    this.$api.updateUserName(this.editUserForm).then((res) => {
                        if (res.success == true) {
                            this.editUserModal = false;
                            this.logoutVisible = true;
                            // this.getUserInfo(true);
                            // this.$store.dispatch("GetUserInfo");
                            // this.$message.success("保存成功");
                            this.loading = false;
                        } else {
                            this.loading = false;
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    this.editUserModal = false;
                }
            });
        },
        getLastLoginIpInfo() {
            this.$api.getLastLoginIpInfo().then((res) => {
                if (res && res.data && res.success == true) {
                    this.$notify.info({
                        title: "上次登录信息",
                        customClass: "first-login",
                        // duration:0,
                        dangerouslyUseHTMLString: true,
                        position: "bottom-right",
                        message: `<p><span>登录时间：</span>${
                            res.data.lastLoginTime || ""
                        }</p><p><span>登录地点：</span>${
                            res.data.lastLoginLocation || ""
                        }</p><p><span>IP地址：</span>${
                            res.data.lastLoginIp || ""
                        }</p>`,
                    });
                }
            });
        },
        changeLanguage(lang) {
            window.localStorage.setItem("omsLanguage", lang);
            this.$i18n.locale = lang;
        },
        mapGet() {
            this.$api.mapGet().then((res) => {
                if (res.success == true) {
                    this.mapKey = res.data;
                }
            });
        },
        mapSet() {
            this.$api.mapSet(this.mapKey).then((res) => {
                if (res.success == true) {
                    this.$message.success("保存成功");
                }
            });
        },
        showDeepSeek() {
            this.isShowDeepseek = !this.isShowDeepseek;
        },
    },
    destroyed() {
        clearInterval(this.refreshSessionHandle);
    },
};
</script>
<style lang="less">
.about-dialog {
    .el-dialog__header {
        background: #00a0e9;
        .el-dialog__title {
            color: #ffffff;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #ffffff !important;
        }
    }
    .el-dialog__body {
        padding: 0;
    }
    .about-top {
        background: #00a0e9;
        color: #ffffff;
        padding: 26px 26px 42px;
        display: flex;
        flex-direction: row;
        .logo {
            width: 180px;
            margin-right: 32px;
            img {
                width: 100%;
            }
        }
        .name {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .platform-name {
                font-size: 24px;
                line-height: 22px;
                font-family: PingFangSC-Medium;
                margin-bottom: 16px;
            }
            .platform-version {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.85);
                line-height: 1;
                font-family: PingFangSC-Medium;
            }
        }
    }
    .about-bottom {
        height: 62px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .word {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
            line-height: 22px;
            cursor: pointer;
            &.left {
                margin-right: 40px;
            }
            img {
                width: 13px;
            }
        }
    }
}
.edit-user {
    .el-form {
        .el-form-item {
            margin-bottom: 22px !important;
        }
        .el-input {
            width: 310px;
        }
    }
}
.faq-file {
    .el-dialog__header {
        padding: 10px 20px;
        .el-dialog__headerbtn {
            top: 10px;
        }
    }
    .el-dialog__body {
        padding: 0px;
        height: calc(~"100% - 44px");
        & > div {
            height: 100%;
            .docx-wrapper {
                height: 100%;
                overflow-y: auto;
            }
        }
    }
}
.headbar-dropdown-menu {
    li {
        & > div {
            display: flex;
            height: 36px;
            line-height: 36px;
            align-items: center;
            img {
                margin-right: 5px;
            }
        }
    }
}
.el-menu--horizontal.headbar-menu {
    width: 100%;
    left: 0px !important;
    background-color: #2e87ff !important;

    .el-menu--popup {
        padding: 0px !important;
        margin-top: 0px !important;
        width: 100%;
    }
    .avtive {
        color: #2e87ff;
    }
    .popLeft {
        left: 0 !important;
    }
    .el-menu-item {
        height: 49px !important;
        line-height: 49px !important;
        color: hsla(0, 0%, 100%, 0.6);
        &:hover {
            background: #2e87ff !important;
        }
    }
    .el-menu-item:hover {
        color: #fff;
        background: #2e87ff;
    }
    .el-submenu.is-opened .el-menu-item {
        width: 100% !important;
    }
    .el-submenu {
        position: static !important;
    }
    .el-submenu .el-submenu__title {
        height: 49px !important;
        line-height: 49px !important;
        color: hsla(0, 0%, 100%, 0.6);
    }
    .el-submenu > .el-menu {
        top: 49px !important;
        left: -363px !important;
        overflow: auto;
    }
    .el-submenu .el-submenu__icon-arrow {
        color: hsla(0, 0%, 100%, 0.6) !important;
    }
    .el-submenu.is-active:not(.is-opened) > .el-submenu__title {
        background-color: #2e87ff !important;
    }

    .el-submenu.is-opened {
        background: #2e87ff !important;
        .el-submenu__title {
            color: #fff !important;
        }
    }
    .el-submenu:hover .el-submenu__title {
        color: #fff !important;
    }
    .el-submenu__title:hover {
        background: #2e87ff !important;
        color: #fff !important;
        .el-submenu__icon-arrow {
            color: #fff !important;
        }
    }
    .isAvtive {
        color: #fff !important;
        background: #2e87ff !important;
        border: none !important;
        .el-submenu__title {
            color: #fff !important;
            .el-submenu__icon-arrow {
                color: #fff !important;
            }
        }
    }
    .homne-router {
        font-size: 14px;
        display: flex;
        a {
            height: 100%;
        }
        &:hover {
            a {
                color: #fff !important;
                opacity: 1;
            }
        }
    }
}
.el-menu--horizontal {
    .menu-box {
        display: flex;
        padding: 24px 0 36px;
        position: relative;
        & > div {
            display: flex;
        }
        .el-icon-close {
            position: absolute;
            right: 24px;
            top: 24px;
            width: 20px;
            height: 20px;
            font-size: 20px;
            cursor: pointer;
            color: #000000;
        }
        .second-name {
            display: flex;
            flex-direction: column;
            &:not(:last-child) {
                margin-right: 4px;
            }
            p {
                color: rgba(0, 0, 0, 0.85);
                line-height: 40px;
                font-size: 14px;
                cursor: default;
                font-weight: bold;
                display: block;
                padding-left: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid #ebebeb;
                position: relative;
                min-width: 170px;
            }
            span {
                display: block;
                cursor: pointer;
                height: 22px;
                line-height: 22px;
                margin-top: 8px;
                font-size: 14px;
                font-weight: 400;
                a {
                    padding-left: 10px;
                    opacity: 0.8;
                    color: #000;
                    line-height: 22px;
                    height: 22px;
                    display: block;
                    white-space: nowrap;
                    font-weight: 400;
                    min-width: 170px;
                    font-size: 14px;
                    &:hover {
                        color: #2e87ff;
                    }
                    &.avtive {
                        color: #2e87ff;
                    }
                }
            }
        }
    }
}
.el-menu--horizontal.headbar-menu > .el-menu-item:not(.is-disabled).is-active {
    color: hsla(0, 0%, 100%, 0.6);
    background: #2e87ff;
    border: none !important;
}

.fontSize {
    font-size: 12px;
    font-weight: 600;
}
.positionRight {
    position: absolute;
    right: 24px;
    top: 24px;
    font-size: 20px;
    cursor: pointer;
    color: #000;
}
.dialogMenu {
    width: 100%;
    top: 3.5rem;
    z-index: 1000;
    padding: 25px 0 25px 350px;
    background: #fff;
    color: #000;
}

.menu-box {
    padding-left: 363px !important;
    float: left;
    // margin-right: 10px;
}
@media screen and (max-width: 1430px) {
    .el-menu > .menu-box {
        padding-left: 163px !important;
    }
}
// .second-name{
//   margin-top: 10px;
//   padding-left: 10px;
// }
.menuTitle {
    color: rgba(0, 0, 0, 0.85);
    line-height: 40px;
    font-size: 14px;
    cursor: default;
    font-weight: 700;
    display: block;
    padding-left: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ebebeb;
}
// .second-name{
//   margin-right: 5px;
// }
.background {
    background-color: #2e87ff !important;
}
.secondTitile:hover {
    color: #fff !important;
}
.thirdTitile:hover {
    color: #1890ff !important;
}
.activeMenu {
    color: #fff !important;
}
.activeThird {
    color: #1890ff !important;
}
.showColor {
    color: rgb(237, 133, 144);
}
.title {
    font-size: 14px;
    padding: 14px 0 5px;
}
.titleJkn {
    font-size: 14px;
}
.contentJkn {
    padding: 4px 0 0 0px;
    font-size: 12px;
    display: block;
    text-indent: 26px;
}
.showColorJkn {
    color: rgb(237, 133, 144);
    font-size: 16px;
}
.noColorJkn {
    font-size: 16px;
}
.content {
    padding: 4px 0 0 0px;
    font-size: 12px;
    display: block;
}
.main-m-li {
    cursor: pointer;
    float: left;
    line-height: 52px;
    box-sizing: border-box;
    height: 50px;
    white-space: nowrap;
    z-index: 3;
    transition: all 0.2s ease-in-out;
    .header-border {
        box-sizing: border-box;
        height: 58px;
        border-bottom: 2px solid transparent;
        padding-right: 3rem;
    }
    &:hover .header-border {
        border-bottom: 2px solid #fff;
    }
    > span {
        font-size: 14px;
        color: #fff;
    }
    .first-menu {
        font-size: 14px;
        color: #fff;
    }
}
.mitem {
    padding: 0;
    display: inline-block;
    vertical-align: top;
    .caption {
        text-align: left;
        cursor: default;
        padding: 1rem 0 1rem 1rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid #ededed;
        .mh-txt {
            font-size: 14px;
            color: #000;
            opacity: 0.56;
            padding-left: 10px;
        }
        &:last-child {
            padding-right: 0;
        }
        &:first-child {
            padding-left: 1rem;
        }
    }
}
.only-second-menu {
    font-size: 14px;
    color: #000;
    line-height: 40px;
    padding-left: 1rem;
    &:hover {
        background: #f5f5f5;
    }
}
.full-menu-service {
    height: auto;
    top: 60px;
    position: absolute;
    z-index: 10000;
    background: #fff;
    box-sizing: border-box;
    opacity: 1;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
}
.main-m-li.hover {
    .full-menu {
        display: block;
        opacity: 1;
        width: auto;
        height: auto;
        transition: height 0.2s;
        padding-bottom: 0.5rem;
    }
}
.full-menu .sub-menu-warp {
    line-height: normal;
}
.alarm-badge {
    background: #ed3f14;
}
.blackTime {
    margin-right: 8px;
    z-index: 9999;
}
.navbar-nav {
    display: flex;
    align-items: center;
}
.iconfont-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -2px;
    width: 30px;
    i,
    img {
        font-size: 20px;
        cursor: pointer;
        margin: 0 5px 0px 0;
        &:hover {
            opacity: 0.8;
        }
    }
}
.myPopover {
    padding: 0 0 0 0 !important;
}
.first-login {
    .el-notification__content {
        p {
            margin-top: 10px;
        }
    }
}
</style>
<style lang="less" scoped>
.assistant {
    cursor: pointer;
    position: relative;
    z-index: 999999999999;
    background: #fff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-image: url("/static/images/deepseek/ai_btn.svg");
    // background-size: cover;
    .svg-icon {
        z-index: 1;
    }
    &&::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        animation: gradient 1s linear infinite;
        background-image: linear-gradient(
            to bottom right,
            #c270fe 30%,
            #15d2ff 100%
        );
    }
}
.ai-box {
    width: 100px;
    cursor: pointer;
    img {
        width: 28px;
        height: 28px;
    }
    .ai-text {
        background-image: linear-gradient(to right, #c270fe 20%, #15d2ff 100%);
        animation: gradient-text 4s linear infinite;
        -webkit-background-clip: text;
        color: transparent;
        font-size: 14px;
        font-weight: 600;
        margin-left: 4px;
    }
}
.infoBox {
    width: 290px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 24px;
    font-weight: 400;
    .borderStyle {
        border-right: 1px solid #e9e9e9;
    }
    .inlineItem {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
    }
    .b-bo {
        border-bottom: 1px solid #e9e9e9;
    }
    .img-style {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
    .userInfo {
        padding: 16px 20px 12px;
        height: 84px;
        background: #f7f7f7;
        .subInfo {
            height: 24px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 24px;
            font-weight: 400;
            display: flex;
            align-items: center;
            .label-name {
                width: 30px;
            }
            .value-name {
                width: 105px;
                margin-right: 12px;
            }
            .value-phoneNo {
                width: 80px;
            }
            .value-name,
            .value-phoneNo {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .mainInfo {
            display: inline-block;
            height: 24px;
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 24px;
            font-weight: 400;
            margin: 0px 8px 8px 0px;
        }
    }
    .infoitem {
        padding: 8px 20px;
        display: flex;
        align-items: center;
        &:hover {
            color: #409eff;
            background: #ecf5ff;
        }
    }
    .qscode {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.logout-msg {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    i {
        color: #02bf0f;
        font-size: 22px;
        margin-right: 12px;
    }
}
</style>
<style lang="less">
.download-task-dialog {
    .el-dialog__body {
        padding: 0px;
        height: calc(~"100% - 70px");
        .el-tabs__header {
            margin: 0px;
        }
    }
    .el-dialog__header {
        background: #000000;
        padding: 20px;
        .download-task-title {
            display: flex;
            color: #ffffff;
            justify-content: space-between;
            .el-button {
                color: #ffffff;
            }
            h2 {
                font-size: 20px;
            }
        }
        .el-dialog__headerbtn {
            display: none;
        }
    }
}
</style>
