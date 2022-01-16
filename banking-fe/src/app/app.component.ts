import { Component, Inject, LOCALE_ID, OnInit, Renderer2 } from '@angular/core';
import { ConfigService } from '../@vex/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { Style, StyleService } from '../@vex/services/style.service';
import { ConfigName } from '../@vex/interfaces/config-name.model';
import { sidebarAdminContent, sidebarPdgContent } from './sidebar-contents';
import { io } from "socket.io-client";
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vex';
  sidebarAdminContent: any[] = sidebarAdminContent;
  private socket: any;
  public data: any;
  private stompClient;
  constructor(private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
      this.biggestSequenceLengthIndex([1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1]);
    }
    // this.socket = io('http://127.0.0.1:5000', {
    //   query: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0N2VhMjY5LTlkM2QtNDRhYi1hZTA0LWY5MDhkOWEzMzViYiIsImlhdCI6MTYyNTM0NTIzOSwiZXhwIjoxNjI1NDMxNjM5fQ.Ozf2ayBE68IQY5TkvsWk2ebQlKHgamquyiDUHvXU860"}
    // });

    // this.socket = io('http://127.0.0.1:5000', {
    //   query: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5MWRhYWFmLWZjNWYtNDdkNi1iOWYyLWI4MmQ3ZmJjYzZkNCIsImlhdCI6MTYyNTQyOTc2OSwiZXhwIjoxNjI1NTE2MTY5fQ.PI3XruPt6vxcq6WN0dO23-4ttU7JmLWFd0i0WEyYtm4"}
    // });


    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    showConfigButton: false,
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
    ).subscribe(isRtl => {
      this.document.body.dir = isRtl ? 'rtl' : 'ltr';
      this.configService.updateConfig({
        rtl: isRtl
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));


    this.navigationService.items = this.sidebarAdminContent;
  }

  ngOnInit() {

  }

  biggestSequenceLengthIndex(tab) {
    var indexes = [];
    tab.forEach((element, i) => {
      if (element == 0) {
        indexes.push(i)
      }
    });
    const max = this.sequenceLength(tab, indexes).reduce(function (prev, current) {
      return (prev.sequenceLength > current.sequenceLength) ? prev : current
    })
    return max.index
  }

  sequenceLength(tab, indexes) {
    var result = [];
    indexes.forEach(element => {
      if (element == 0) {
        result.push({ index: element, sequenceLength: this.count(tab, element, 'after') + 1 })
      }
      else if (element == tab.length - 1) {
        result.push({ index: element, sequenceLength: this.count(tab, element, 'before') + 1 })
      }
      else {
        result.push({ index: element, sequenceLength: this.count(tab, element, 'before') + this.count(tab, element, 'after') + 1 })
      }
    });
    return result;
  }

  count(tab, index, type) {
    var i = index;
    var res = 0;
    if (type == 'before') {
      while (tab[i - 1] == 1) {
        res++;
        i--;
      }
    }
    else {
      while (tab[i + 1] == 1) {
        res++;
        i++;
      }
    }
    return res;
  }
}
