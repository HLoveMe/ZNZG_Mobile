//
//  ZNBluetoothDetection.h
//  云上展馆
//
//  Created by space on 2017/11/20.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
@interface ZNBluetoothDetection : CDVPlugin

/**
 开始监听蓝牙 状态

 @param command
 */
-(void)startListenCentralUpdate:(CDVInvokedUrlCommand *)command;

/**
 打开蓝牙设置

 @param command
 */
-(void)openBluetoothSetting:(CDVInvokedUrlCommand *)command;
@end
