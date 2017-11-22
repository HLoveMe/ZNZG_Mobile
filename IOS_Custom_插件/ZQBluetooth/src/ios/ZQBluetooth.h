//
//  ZGBluetooth.h
//  云上展馆
//
//  Created by space on 2017/11/14.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
@interface ZQBluetooth : CDVPlugin
-(void)startListen:(CDVInvokedUrlCommand *)command;
-(void)endListen:(CDVInvokedUrlCommand *)command;
@end
