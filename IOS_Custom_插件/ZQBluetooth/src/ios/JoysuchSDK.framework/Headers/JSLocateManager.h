//
//  JSLocateManager.h
//  SeekcyBeaconSDK
//
//  Created by seekcy on 15/8/4.
//  Copyright (c) 2015年 com.seekcy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSPosition.h"
@class CLHeading;

@protocol JSLocateManagerDelegate <NSObject>


// 定位结果返回
- (void)jsLocateManagerDidUpdateLocation:(JSPosition *)location sensorInfo:(NSString *)sensorInfo;

// 罗盘值
- (void)jsLocateManagerDidUpdateLocationManagerHeading:(CLHeading *)newHeading;

@end

@interface JSLocateManager : NSObject

// delegate
@property (nonatomic, weak) id<JSLocateManagerDelegate> delegate;
// 防篡改key
@property (nonatomic, strong) NSString *decryptionKey;
// 开放平台licence
@property (nonatomic, strong) NSString *appkey;
// 是否上传定位结果到开放平台 (v2.6.0新增)
@property (nonatomic) BOOL isUploadPosition;


/*!
 *  @method sharedDefaults
 *
 *  @discussion 单例
 *
 */
+ (JSLocateManager *)sharedDefaults;


/*!
 *  @method initLocationLibrary:
 *
 *
 *  @param  UUIDs  扫描的beacon uuid， 如果为nil， 默认微信uuid。
 *
 *  @discussion 初始化定位引擎
 *
 */
- (void)initLocationLibraryWithUUIDs:(NSArray *)UUIDs;


/*!
 *  @method setDeflectionAngle:
 *
 *  @discussion 设置偏转角
 *
 */
- (void)setDeflectionAngle:(int)deflectionAngle;

/*!
 *  @method setOfflineMode
 *
 *  @discussion 设置为离线模式：数据本地存储
 *
 */
- (void)setOfflineMode;


/*!
 *  @method setOnlineMode
 *
 *  @discussion 设置为在线模式：自动下载更新定位数据
 *
 */
- (void)setOnlineMode;



/*!
 *  @method setLocateTimesSecond:
 *
 *  @discussion 设置定位每秒返回次数，由于扫描是基本1秒左右一次，所以这边的每秒返回是一个滤波的点位信息
 *
 */
- (void)setLocateTimesSecond:(int)times;


/*!
 *  @method setUploadPosition:
 *
 *  @discussion 是否上传定位数据到云端平台：默认为false  (v2.6.0新增)
 *
 */
- (void)setUploadPosition:(BOOL)isUpload;


/*!
 *  @method start
 *
 *  @discussion 开启扫描服务
 *
 */
- (void)start;


/*!
 *  @method stop
 *
 *  @discussion 关闭扫描服务
 *
 */
- (void)stop;


/*!
 *  @method getVersion
 *
 *  @discussion 获取版本名称, 目前为@""
 *
 */
- (NSString *)getVersion;

/*!
 *  @method getIdentifierForVendor
 *
 *  @discussion 获取设备的IdentifierForVendor (v2.6.0新增)
 *
 */
- (NSString *)getIdentifierForVendor;

/*!
 *  @method getAccessToken
 *
 *  @discussion 获取accesstoken (v2.6.0新增)
 *
 */
- (NSString *)getAccessToken;


/*!
 *  @method deletePositionalFile
 *
 *  @discussion 删除定位文件 (v2.6.0新增)
 *
 */
- (BOOL)deletePositionalFile;


- (NSString *)getLocationAppKey;

@end
