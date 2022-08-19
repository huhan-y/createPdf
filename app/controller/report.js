'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const puppeteer = require('puppeteer');
const moment = require('moment');

class ReportController extends Controller {
  async index() {
    const { ctx } = this;
    const { header,body } = ctx.request
    // 要生成pdf的页面的url
    const url = `${header.origin}/pdf/${body.id}`
    
    // 启动pupeteer，加载页面
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });

    // 生成pdf
    let pdfFileName = `${body.name}-成绩单-${moment(new Date()).format('YYYYMMDDHHmm')}.pdf`
    let pdfFilePath = path.join(__dirname, '../../temp/', pdfFileName);
    await page.pdf({
      path: pdfFilePath,
      format: 'A4',
      scale: 1,
      printBackground: true,
      landscape: false,
      displayHeaderFooter: false
    });
    // 关闭浏览器
    browser.close();
    // 返回文件路径
    ctx.status = 200
    ctx.body ={
      filePata: `/resource/${pdfFileName}`
    }
  }
}

module.exports = ReportController;
